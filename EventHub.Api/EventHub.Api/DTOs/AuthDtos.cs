namespace EventHub.Api.DTOs
{
    public record RegisterDto(string Email, string Password, string DisplayName);
    public record LoginDto(string Email, string Password);
    public record AuthResponse(string Token, string UserId, string DisplayName, string Email);
}
