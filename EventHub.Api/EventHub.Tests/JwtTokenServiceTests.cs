using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using EventHub.Api.Models;
using EventHub.Api.Services; 
using Microsoft.Extensions.Configuration;
using Xunit;

namespace EventHub.Api.Tests
{
    public class JwtTokenServiceTests
    {
        private readonly IConfiguration _config;

        public JwtTokenServiceTests()
        {
            // Fake configuration for tests
            var settings = new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "super-secret-test-key-1234567890",
                ["Jwt:Issuer"] = "test-issuer",
                ["Jwt:Audience"] = "test-audience"
            };

            _config = new ConfigurationBuilder()
                .AddInMemoryCollection(settings)
                .Build();
        }

        [Fact]
        public void Create_ShouldGenerateToken_WithExpectedClaims()
        {
            // arrange
            var service = new JwtTokenService(_config);

            var user = new User
            {
                Id = "user-123",
                Email = "test@example.com",
                DisplayName = "Test User"
            };

            // act
            var tokenString = service.Create(user);

            // assert – token is not null/empty
            Assert.False(string.IsNullOrWhiteSpace(tokenString));

            var handler = new JwtSecurityTokenHandler();
            Assert.True(handler.CanReadToken(tokenString));

            var token = handler.ReadJwtToken(tokenString);

            // claims
            string? sub = token.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value;
            string? nameId = token.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            string? email = token.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Email)?.Value;
            string? name = token.Claims.FirstOrDefault(c => c.Type == "name")?.Value;

            Assert.Equal(user.Id, sub);
            Assert.Equal(user.Id, nameId);
            Assert.Equal(user.Email, email);
            Assert.Equal(user.DisplayName, name);

            // issuer / audience
            Assert.Equal("test-issuer", token.Issuer);
            Assert.Contains("test-audience", token.Audiences);

            // expiration is in the future (with a small safety margin)
            Assert.NotNull(token.ValidTo);
            Assert.True(token.ValidTo > DateTime.UtcNow.AddMinutes(-1));
        }
    }
}
