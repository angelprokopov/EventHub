using Microsoft.AspNetCore.Mvc;

namespace EventHub.Api.Controllers
{
    [ApiController]
    [Route("api/events/{eventId}/[controller]")]
    public class EventsController : ControllerBase
    {
    }
}
