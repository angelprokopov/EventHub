using EventHub.Api.Data;
using EventHub.Api.DTOs;
using EventHub.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace EventHub.Api.Controllers
{
    [ApiController]
    [Route("api/events/{eventId}/[controller]")]
    public class CommentsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CommentsController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Comment>>> GetForEvent(string eventId) => 
            await _context.Comments.Where(c=>c.EventId==eventId).OrderByDescending(c=>c.CreatedAt).ToListAsync();
        
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Comment>> Create(string eventId, CommentCreateDto dto)
        {
            if (!await _context.Events.AnyAsync(e => e.Id == eventId))
                return NotFound("");

            var uid = User.FindFirst("sub")?.Value;
            var c = new Comment
            {
                EventId = eventId,
                AuthorId = uid,
                Text = dto.Text
            };
            _context.Comments.Add(c);
            await _context.SaveChangesAsync();
            return Created($"api/events/{eventId}/comments/{c.Id}", c);
        }

        [Authorize]
        [HttpDelete("{commentId}")]
        public async Task<IActionResult> Delete(string eventId,string commentId)
        {
            var c = await _context.Comments.FindAsync(commentId);
            if (c is null || c.Id != eventId)
                return NotFound();

            var uid = User.FindFirst("sub")?.Value;
            if (uid != c.AuthorId)
                return Forbid();
            _context.Comments.Remove(c);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
