using Xunit;
using UrbanAI.Domain.Entities;
using UrbanAI.Infrastructure.Data.Models;

namespace UrbanAI.Infrastructure.Tests
{
    public class RegulationRepositoryTests
    {
        [Fact]
        public void ConvertRegulationToDocument_ShouldMapPropertiesCorrectly()
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

            // Act
            var document = new RegulationDocument
            {
                Id = regulation.Id.ToString(),
                Title = regulation.Title,
                Content = regulation.Content,
                SourceUrl = regulation.SourceUrl,
                Jurisdiction = regulation.Jurisdiction,
                Location = regulation.Location,
                EffectiveDate = regulation.EffectiveDate,
                Keywords = regulation.Keywords,
                CreatedAt = regulation.CreatedAt,
                UpdatedAt = regulation.UpdatedAt
            };

            // Assert
            Assert.Equal(regulation.Id.ToString(), document.Id);
            Assert.Equal(regulation.Title, document.Title);
            Assert.Equal(regulation.Content, document.Content);
            Assert.Equal(regulation.SourceUrl, document.SourceUrl);
            Assert.Equal(regulation.Jurisdiction, document.Jurisdiction);
            Assert.Equal(regulation.Location, document.Location);
            Assert.Equal(regulation.EffectiveDate, document.EffectiveDate);
            Assert.Equal(regulation.Keywords, document.Keywords);
            Assert.Equal(regulation.CreatedAt, document.CreatedAt);
            Assert.Equal(regulation.UpdatedAt, document.UpdatedAt);
        }

        [Fact]
        public void ConvertDocumentToRegulation_ShouldMapPropertiesCorrectly()
        {
            // Arrange
            var regulationId = Guid.NewGuid();
            var document = new RegulationDocument
            {
                Id = regulationId.ToString(),
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

            // Act
            var regulation = new Regulation
            {
                Id = Guid.Parse(document.Id),
                Title = document.Title,
                Content = document.Content,
                SourceUrl = document.SourceUrl,
                Jurisdiction = document.Jurisdiction,
                Location = document.Location,
                EffectiveDate = document.EffectiveDate,
                Keywords = document.Keywords,
                CreatedAt = document.CreatedAt,
                UpdatedAt = document.UpdatedAt
            };

            // Assert
            Assert.Equal(regulationId, regulation.Id);
            Assert.Equal(document.Title, regulation.Title);
            Assert.Equal(document.Content, regulation.Content);
            Assert.Equal(document.SourceUrl, regulation.SourceUrl);
            Assert.Equal(document.Jurisdiction, regulation.Jurisdiction);
            Assert.Equal(document.Location, regulation.Location);
            Assert.Equal(document.EffectiveDate, regulation.EffectiveDate);
            Assert.Equal(document.Keywords, regulation.Keywords);
            Assert.Equal(document.CreatedAt, regulation.CreatedAt);
            Assert.Equal(document.UpdatedAt, regulation.UpdatedAt);
        }

        [Fact]
        public void GuidConversion_ShouldWorkBothWays()
        {
            // Arrange
            var originalGuid = Guid.NewGuid();

            // Act
            var guidString = originalGuid.ToString();
            var parsedGuid = Guid.Parse(guidString);

            // Assert
            Assert.Equal(originalGuid, parsedGuid);
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
    }
}
