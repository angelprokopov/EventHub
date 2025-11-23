namespace EventHub.Api.Models
{
    public class User
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;

        public bool EmailConfirmed { get; set; } = false;
        public string? EmailConfirmationCode { get; set; }
    }
}
