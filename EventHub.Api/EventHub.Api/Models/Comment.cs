namespace EventHub.Api.Models
{
    public class Comment
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string EventId { get; set; } = string.Empty;
        public string AuthorId { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
