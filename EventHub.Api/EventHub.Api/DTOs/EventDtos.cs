namespace EventHub.Api.DTOs
{
    public record EventCreateDto(string Title, string Description,DateTime StartAt, string Location, decimal? Price,string ImageUrl, string Category);
    public record EventUpdateDto(string Title, string Description, DateTime StartAt, string Location, decimal? Price, string ImageUrl, string Category);
}
