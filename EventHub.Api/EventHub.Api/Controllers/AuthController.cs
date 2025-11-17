using EventHub.Api.Data;
using EventHub.Api.DTOs;
using EventHub.Api.Models;
using EventHub.Api.Services;
using Microsoft.AspNetCore.Mvc;
using System.Data.Entity;
using System.Security.Cryptography;
using System.Security.Policy;
using System.Text;

namespace EventHub.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _appDb;
        private readonly JwtTokenService _jwt;

        public AuthController(AppDbContext appDb, JwtTokenService jwt)
        {
            _appDb = appDb;
            _jwt = jwt;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register(RegisterDto dto)
        {
            if (await _appDb.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("");

            var user = new User { Email = dto.Email, DisplayName = dto.DisplayName, PasswordHash = Hash(dto.Password) };
            _appDb.Users.Add(user);
            await _appDb.SaveChangesAsync();
            var token = _jwt.Create(user);
            return new AuthResponse(token, user.Id, user.DisplayName, user.Email);
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(LoginDto dto)
        {
            var user = await _appDb.Users.FirstOrDefaultAsync(u=>u.Email == dto.Email);
            if(user is null || user.PasswordHash != Hash(dto.Password)))
                    return Unauthorized();

            var token = _jwt.Create(user);
            return new AuthResponse(token, user.Id, user.Email, user.DisplayName);
        }

        private static string Hash(string input)
        {
            using var hash = SHA256.Create();
            return Convert.ToHexString(hash.ComputeHash(Encoding.UTF8.GetBytes(input)));
        } 
    }
}
