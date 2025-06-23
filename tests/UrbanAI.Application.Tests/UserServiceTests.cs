using Xunit;
using Moq;
using System;
using System.Threading.Tasks;
using UrbanAI.Application.Features.Users;
using UrbanAI.Domain.Entities;

namespace UrbanAI.Application.Tests
{
    public class UserServiceTests
    {
        private readonly UserService _userService;

        public UserServiceTests()
        {
            _userService = new UserService();
        }

        [Fact]
        public async Task GetOrCreateAnonymousUserAsync_ShouldThrowNotImplementedException()
        {
            // Arrange
            var provider = "google";
            var externalId = "12345";

            // Act & Assert
            await Assert.ThrowsAsync<NotImplementedException>(
                () => _userService.GetOrCreateAnonymousUserAsync(provider, externalId));
        }
    }
}
