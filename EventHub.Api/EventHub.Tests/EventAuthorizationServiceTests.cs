using EventHub.Api.Models;
using EventHub.Api.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EventHub.Api.Services;
using EventHub.Api.Models;
using Xunit;

namespace EventHub.Tests
{
    public class EventAuthorizationServiceTests
    {
        [Fact]
        public void CanEdit_ReturnsTrue_WhenUserIsOwner()
        {
            var service = new EventAuthorizationService();
            var ev = new Event
            {
                Id = Guid.NewGuid().ToString(),
                CreatedBy = "user-123"
            };

            var result = service.CanEdit(ev, "user-123");

            Assert.True(result);
        }
        [Fact]
        public void CanEdit_ReturnsFalse_WhenUserIsNotOwner()
        {
            var service = new EventAuthorizationService();
            var ev = new Event
            {
                Id = Guid.NewGuid().ToString(),
                CreatedBy = "user-123"
            };

            var result = service.CanEdit(ev, "user-999");

            Assert.False(result);
        }
    }
}
