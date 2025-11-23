using EventHub.Api.Data;
using EventHub.Api.DTOs;
using EventHub.Api.Models;
using EventHub.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        private readonly IEmailService _emailService;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext appDb, JwtTokenService jwt, IEmailService emailService, IConfiguration config)
        {
            _appDb = appDb;
            _jwt = jwt;
            _emailService = emailService;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register(RegisterDto dto)
        {
            if (await _appDb.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("Email is in use!");

            var confirmationCode = Guid.NewGuid().ToString("N");
            var user = new User
            {
                Email = dto.Email,
                DisplayName = dto.DisplayName,
                PasswordHash = Hash(dto.Password),
                EmailConfirmed = false,
                EmailConfirmationCode = confirmationCode,
            };

            _appDb.Users.Add(user);
            await _appDb.SaveChangesAsync();
            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            var confirmUrl = $"{baseUrl}/api/auth/confirm?userId={user.Id}&code={confirmationCode}";
            var body = $@"
            <h2>Welcome to EventHub, {user.DisplayName}!</h2>
            <p>Thanks for registering. Please confirm your email by clicking the button below:</p>
            <p><a href=""{confirmUrl}"" style=""padding:10px 16px;background:#6c5ce7;color:white;text-decoration:none;border-radius:4px;"">
                Confirm my email
            </a></p>
            <p>If the button does not work, copy this link into your browser:</p>
            <p>{confirmUrl}</p>
            ";

            await _emailService.SendAsync(user.Email, "Confirm your EventHub account",body);
            
            var token = _jwt.Create(user);
            return new AuthResponse(token, user.Id, user.DisplayName, user.Email);
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(LoginDto dto)
        {
            var user = await _appDb.Users.FirstOrDefaultAsync(u=>u.Email == dto.Email);
            if(user is null || user.PasswordHash != Hash(dto.Password))
                    return Unauthorized();

            var token = _jwt.Create(user);
            return new AuthResponse(token, user.Id, user.Email, user.DisplayName);
        }

        [HttpGet("confirm")]
        public async Task<IActionResult> ConfirmEmail([FromQuery] string userId, [FromQuery] string code)
        {
            var user = await _appDb.Users.FindAsync(userId);
            var frontEnd = _config["Frontend:BaseUrl"] ?? "https://localhost:7132/";
            if (user is null)
                return NotFound("User not found");
            
            if (user.EmailConfirmed)
                return Ok("Email already confirmed");

            if (user.EmailConfirmationCode != code)
                return BadRequest("Invalid confirmation code");

            user.EmailConfirmed = true;
            user.EmailConfirmationCode = null;
            await _appDb.SaveChangesAsync();

            return Redirect($"{frontEnd}/login?confirmed=1");
        }

        private static string Hash(string input)
        {
            using var hash = SHA256.Create();
            return Convert.ToHexString(hash.ComputeHash(Encoding.UTF8.GetBytes(input)));
        } 
    }
}
