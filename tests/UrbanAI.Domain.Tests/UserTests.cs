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
        public void User_CanSetAndGetProperties()
        {
            // Arrange
            var user = new User();
            var username = "testuser";
            var email = "test@example.com";
            var passwordHash = "hashedpassword";
            var role = "Admin";
            var createdAt = DateTime.UtcNow;

            // Act
            user.Username = username;
            user.Email = email;
            user.PasswordHash = passwordHash;
            user.Role = role;
            user.CreatedAt = createdAt;

            // Assert
            Assert.Equal(username, user.Username);
            Assert.Equal(email, user.Email);
            Assert.Equal(passwordHash, user.PasswordHash);
            Assert.Equal(role, user.Role);
            Assert.Equal(createdAt, user.CreatedAt);
        }

        [Fact]
        public void User_ExternalLoginsCanBeAdded()
        {
            // Arrange
            var user = new User();
            var externalLogin = new ExternalLogin
            {
                Id = Guid.NewGuid(),
                Provider = "Google",
                ExternalId = "google123",
                CreatedAt = DateTime.UtcNow,
                UserId = user.Id
            };

            // Act
            user.ExternalLogins.Add(externalLogin);

            // Assert
            Assert.Contains(externalLogin, user.ExternalLogins);
            Assert.Equal(user.Id, externalLogin.UserId);
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
