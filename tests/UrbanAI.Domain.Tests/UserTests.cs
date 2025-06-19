using Xunit;
using System;
using UrbanAI.Domain.Entities;

namespace UrbanAI.Domain.Tests
{
    public class UserTests
    {
        [Fact]
        public void User_CanBeCreatedWithValidData()
        {
            // Arrange
            var id = Guid.NewGuid();

            // Act
            var user = new User
            {
                Id = id
            };

            // Assert
            Assert.Equal(id, user.Id);
        }

        [Fact]
        public void User_IdIsAutomaticallyGenerated()
        {
            // Act
            var user = new User();

            // Assert
            Assert.NotEqual(Guid.Empty, user.Id); // Assert that Id is not default Guid
        }
    }
}
