using Xunit;
using UrbanAI.Infrastructure.Data.Models;

namespace UrbanAI.Infrastructure.Tests
{
    public class RegulationDocumentTests
    {
        [Fact]
        public void RegulationDocument_ShouldSetProperties_Correctly()
        {
            // Arrange
            var id = Guid.NewGuid().ToString();
            var title = "Test Regulation";
            var content = "Test Content";
            var sourceUrl = "http://test.com";
            var jurisdiction = "Test Jurisdiction";
            var location = "Test Location";
            var effectiveDate = DateTime.UtcNow;
            var keywords = new List<string> { "test", "regulation" };
            var createdAt = DateTime.UtcNow;
            var updatedAt = DateTime.UtcNow;

            // Act
            var document = new RegulationDocument
            {
                Id = id,
                Title = title,
                Content = content,
                SourceUrl = sourceUrl,
                Jurisdiction = jurisdiction,
                Location = location,
                EffectiveDate = effectiveDate,
                Keywords = keywords,
                CreatedAt = createdAt,
                UpdatedAt = updatedAt
            };

            // Assert
            Assert.Equal(id, document.Id);
            Assert.Equal(title, document.Title);
            Assert.Equal(content, document.Content);
            Assert.Equal(sourceUrl, document.SourceUrl);
            Assert.Equal(jurisdiction, document.Jurisdiction);
            Assert.Equal(location, document.Location);
            Assert.Equal(effectiveDate, document.EffectiveDate);
            Assert.Equal(keywords, document.Keywords);
            Assert.Equal(createdAt, document.CreatedAt);
            Assert.Equal(updatedAt, document.UpdatedAt);
        }

        [Fact]
        public void RegulationDocument_ShouldHandleNullKeywords()
        {
            // Arrange & Act
            var document = new RegulationDocument
            {
                Id = Guid.NewGuid().ToString(),
                Title = "Test",
                Content = "Content",
                SourceUrl = "http://test.com",
                Jurisdiction = "Jurisdiction",
                Location = "Location",
                Keywords = null
            };

            // Assert
            Assert.Null(document.Keywords);
        }

        [Fact]
        public void RegulationDocument_ShouldHandleEmptyKeywords()
        {
            // Arrange & Act
            var document = new RegulationDocument
            {
                Id = Guid.NewGuid().ToString(),
                Title = "Test",
                Content = "Content",
                SourceUrl = "http://test.com",
                Jurisdiction = "Jurisdiction",
                Location = "Location",
                Keywords = new List<string>()
            };

            // Assert
            Assert.NotNull(document.Keywords);
            Assert.Empty(document.Keywords);
        }
    }
}
