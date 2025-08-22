using Xunit;
using UrbanAI.Domain.Entities;

namespace UrbanAI.Infrastructure.Tests
{
    public class RegulationRepositoryTests
    {
        [Fact]
        public void RegulationEntity_ShouldHaveCorrectProperties()
        {
            // Arrange
            var regulation = new Regulation
            {
                Id = Guid.NewGuid(),
                Title = "Test Regulation",
                Content = "Test Content",
                SourceUrl = "http://test.com",
                Jurisdiction = "Test Jurisdiction",
                Location = "Test Location",
                EffectiveDate = DateTime.UtcNow,
                Keywords = new List<string> { "test", "regulation" },
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Assert
            Assert.NotEqual(Guid.Empty, regulation.Id);
            Assert.Equal("Test Regulation", regulation.Title);
            Assert.Equal("Test Content", regulation.Content);
            Assert.Equal("http://test.com", regulation.SourceUrl);
            Assert.Equal("Test Jurisdiction", regulation.Jurisdiction);
            Assert.Equal("Test Location", regulation.Location);
            Assert.NotNull(regulation.EffectiveDate);
            Assert.NotNull(regulation.Keywords);
            Assert.Contains("test", regulation.Keywords);
            Assert.Contains("regulation", regulation.Keywords);
            Assert.NotNull(regulation.CreatedAt);
            Assert.NotNull(regulation.UpdatedAt);
        }

        [Fact]
        public void RegulationEntity_ShouldHandleNullKeywords()
        {
            // Arrange & Act
            var regulation = new Regulation
            {
                Id = Guid.NewGuid(),
                Title = "Test",
                Content = "Content",
                SourceUrl = "http://test.com",
                Jurisdiction = "Jurisdiction",
                Location = "Location",
                Keywords = null
            };

            // Assert
            Assert.Null(regulation.Keywords);
        }

        [Fact]
        public void RegulationEntity_ShouldHandleEmptyKeywords()
        {
            // Arrange & Act
            var regulation = new Regulation
            {
                Id = Guid.NewGuid(),
                Title = "Test",
                Content = "Content",
                SourceUrl = "http://test.com",
                Jurisdiction = "Jurisdiction",
                Location = "Location",
                Keywords = new List<string>()
            };

            // Assert
            Assert.NotNull(regulation.Keywords);
            Assert.Empty(regulation.Keywords);
        }

        [Fact]
        public void RegulationEntity_ShouldUpdateProperties()
        {
            // Arrange
            var regulation = new Regulation
            {
                Id = Guid.NewGuid(),
                Title = "Original Title",
                Content = "Original Content",
                SourceUrl = "http://original.com",
                Jurisdiction = "Original Jurisdiction",
                Location = "Original Location",
                EffectiveDate = DateTime.UtcNow.AddDays(-1),
                Keywords = new List<string> { "original" },
                CreatedAt = DateTime.UtcNow.AddDays(-1),
                UpdatedAt = DateTime.UtcNow.AddDays(-1)
            };

            // Act
            regulation.Title = "Updated Title";
            regulation.Content = "Updated Content";
            regulation.Keywords.Add("updated");
            regulation.UpdatedAt = DateTime.UtcNow;

            // Assert
            Assert.Equal("Updated Title", regulation.Title);
            Assert.Equal("Updated Content", regulation.Content);
            Assert.Contains("original", regulation.Keywords);
            Assert.Contains("updated", regulation.Keywords);
            Assert.True(regulation.UpdatedAt > regulation.CreatedAt);
        }

        [Fact]
        public void RegulationEntity_ShouldHaveValidGuid()
        {
            // Arrange & Act
            var regulation = new Regulation
            {
                Id = Guid.NewGuid(),
                Title = "Test",
                Content = "Content",
                SourceUrl = "http://test.com",
                Jurisdiction = "Jurisdiction",
                Location = "Location",
                Keywords = new List<string>()
            };

            // Assert
            Assert.NotEqual(Guid.Empty, regulation.Id);
        }
    }
}
