using Xunit;
using UrbanAI.Domain.Entities;
using System;

namespace UrbanAI.Domain.Tests
{
    public class IssueTests
    {
        [Fact]
        public void Issue_Properties_ShouldBeSetCorrectly()
        {
            // Arrange
            var id = Guid.NewGuid();
            var description = "Test description";
            var photoUrl = "test.jpg";
            var latitude = 42.0;
            var longitude = 21.0;
            var title = "Test Title";
            var status = "Open";
            var createdAt = DateTime.UtcNow;

            // Act
            var issue = new Issue
            {
                Id = id,
                Description = description,
                PhotoUrl = photoUrl,
                Latitude = latitude,
                Longitude = longitude,
                Title = title,
                Status = status,
                CreatedAt = createdAt
            };

            // Assert
            Assert.Equal(id, issue.Id);
            Assert.Equal(description, issue.Description);
            Assert.Equal(photoUrl, issue.PhotoUrl);
            Assert.Equal(latitude, issue.Latitude);
            Assert.Equal(longitude, issue.Longitude);
            Assert.Equal(title, issue.Title);
            Assert.Equal(status, issue.Status);
            Assert.Equal(createdAt, issue.CreatedAt);
        }

        [Fact]
        public void Issue_Id_CanBeAccessed()
        {
            // Arrange
            var issue = new Issue 
            { 
                Description = "Test", 
                Status = "Open" 
            };
            var id = Guid.NewGuid();

            // Act
            issue.Id = id;

            // Assert
            Assert.Equal(id, issue.Id);
        }

        [Fact]
        public void Issue_Description_CanBeAccessed()
        {
            // Arrange
            var issue = new Issue 
            { 
                Description = "Initial", 
                Status = "Open" 
            };
            var description = "Test description";

            // Act
            issue.Description = description;

            // Assert
            Assert.Equal(description, issue.Description);
        }

        [Fact]
        public void Issue_PhotoUrl_CanBeAccessed()
        {
            // Arrange
            var issue = new Issue 
            { 
                Description = "Test", 
                Status = "Open" 
            };
            var photoUrl = "test.jpg";

            // Act
            issue.PhotoUrl = photoUrl;

            // Assert
            Assert.Equal(photoUrl, issue.PhotoUrl);
        }

        [Fact]
        public void Issue_Latitude_CanBeAccessed()
        {
            // Arrange
            var issue = new Issue 
            { 
                Description = "Test", 
                Status = "Open" 
            };
            var latitude = 42.0;

            // Act
            issue.Latitude = latitude;

            // Assert
            Assert.Equal(latitude, issue.Latitude);
        }

        [Fact]
        public void Issue_Longitude_CanBeAccessed()
        {
            // Arrange
            var issue = new Issue 
            { 
                Description = "Test", 
                Status = "Open" 
            };
            var longitude = 21.0;

            // Act
            issue.Longitude = longitude;

            // Assert
            Assert.Equal(longitude, issue.Longitude);
        }

        [Fact]
        public void Issue_Title_CanBeAccessed()
        {
            // Arrange
            var issue = new Issue 
            { 
                Description = "Test", 
                Status = "Open" 
            };
            var title = "Test Title";

            // Act
            issue.Title = title;

            // Assert
            Assert.Equal(title, issue.Title);
        }

        [Fact]
        public void Issue_Status_CanBeAccessed()
        {
            // Arrange
            var issue = new Issue 
            { 
                Description = "Test", 
                Status = "Initial" 
            };
            var status = "Open";

            // Act
            issue.Status = status;

            // Assert
            Assert.Equal(status, issue.Status);
        }

        [Fact]
        public void Issue_CreatedAt_CanBeAccessed()
        {
            // Arrange
            var issue = new Issue 
            { 
                Description = "Test", 
                Status = "Open" 
            };
            var createdAt = DateTime.UtcNow;

            // Act
            issue.CreatedAt = createdAt;

            // Assert
            Assert.Equal(createdAt, issue.CreatedAt);
        }

        [Theory]
        [InlineData("Open")]
        [InlineData("In Progress")]
        [InlineData("Closed")]
        [InlineData("Rejected")]
        public void Issue_Status_CanBeSetToValidValues(string status)
        {
            // Arrange
            var issue = new Issue 
            { 
                Description = "Test", 
                Status = "Initial" 
            };

            // Act
            issue.Status = status;

            // Assert
            Assert.Equal(status, issue.Status);
        }

        [Fact]
        public void Issue_CanBeCreatedWithAllProperties()
        {
            // Arrange & Act
            var issue = new Issue
            {
                Id = Guid.NewGuid(),
                Description = "Road pothole reported",
                PhotoUrl = "pothole.jpg",
                Latitude = 42.0043,
                Longitude = 21.4096,
                Title = "Pothole on Main Street",
                Status = "Open",
                CreatedAt = DateTime.UtcNow
            };

            // Assert
            Assert.NotEqual(Guid.Empty, issue.Id);
            Assert.NotNull(issue.Description);
            Assert.NotNull(issue.PhotoUrl);
            Assert.NotEqual(0, issue.Latitude);
            Assert.NotEqual(0, issue.Longitude);
            Assert.NotNull(issue.Title);
            Assert.NotNull(issue.Status);
            Assert.NotEqual(default(DateTime), issue.CreatedAt);
        }
    }
}
