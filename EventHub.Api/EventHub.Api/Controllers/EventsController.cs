using EventHub.Api.Data;
using EventHub.Api.DTOs;
using EventHub.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace EventHub.Api.Controllers
{
    [ApiController]
    [Route("api/events/{eventId}/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public EventsController(AppDbContext db) => _db = db;
       
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Event>>> GetAll([FromQuery] string? q, [FromQuery] string? location)
        {
            var query = _db.Events.AsQueryable();
            if (!string.IsNullOrWhiteSpace(q))
            {
                query = query.Where(e =>
                    e.Title.Contains(q) ||
                    e.Description.Contains(q));
            }

            var result = await query
                .OrderByDescending(e => e.StartAt)
                .ToListAsync();

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Event>> GetById(string id)
        {
            var ev = await _db.Events.FindAsync(id);
            return ev is null ? NotFound() : ev;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Event>> Create(EventCreateDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirst("sub")?.Value;
            var ev = new Event
            {
                Title = dto.Title,
                Description = dto.Description,
                StartAt = dto.StartAt,
                Location = dto.Location,
                Price = dto.Price,
                ImageUrl = dto.ImageUrl,
                CreatedBy = userId!
            };
            _db.Events.Add(ev);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = ev.Id }, ev);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, EventUpdateDto dto)
        {
            var ev = await _db.Events.FindAsync(id);
            if(ev is null) return NotFound();
            var uid = User.FindFirst("sub")?.Value;
            if (uid != ev.CreatedBy) return Forbid();
            ev.Title = dto.Title;
            ev.Description = dto.Description;
            ev.StartAt = dto.StartAt;
            ev.Location = dto.Location;
            ev.Price = dto.Price;
            ev.ImageUrl = dto.ImageUrl;

            await _db.SaveChangesAsync();
            return NoContent();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var ev = await _db.Events.FindAsync(id);
            if(ev is null ) return NotFound();
            var uid = User.FindFirst("sub")?.Value;
            if (uid != ev.CreatedBy) return Forbid();
            _db.Events.Remove(ev);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [Authorize]
        [HttpPost("{id}/like")]
        public async Task<ActionResult> ToggleLike(string id)
        {
            var ev = await _db.Events.FindAsync(id);
            if (ev is null) return NotFound();

            ev.LikesCount++;

            await _db.SaveChangesAsync();
            return Ok(new { likes = ev.LikesCount });
        }
    }
}
