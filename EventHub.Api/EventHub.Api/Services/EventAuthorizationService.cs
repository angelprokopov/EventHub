using EventHub.Api.Models;

namespace EventHub.Api.Services
{
    public class EventAuthorizationService
    {
        public bool CanEdit(Event e, string userId) => e.CreatedBy == userId;
    }
}
