using Xunit;
using System;
using System.Collections.Generic;
using UrbanAI.Domain.Entities;

namespace UrbanAI.Domain.Tests
{
    public class RegulationTests
    {
        [Fact]
        public void Regulation_CanBeCreatedWithValidData()
        {
            // Arrange
            var id = Guid.NewGuid();
            var title = "Test Regulation";
            var content = "This is the content of the test regulation.";
            var effectiveDate = DateTime.UtcNow.AddDays(-10);
            var location = "City A";
            var keywords = new List<string> { "keyword1", "keyword2" };
            var sourceUrl = "http://example.com/regulation";
            var jurisdiction = "State X";
            var createdAt = DateTime.UtcNow.AddDays(-20);
            var updatedAt = DateTime.UtcNow.AddDays(-5);

            // Act
            var regulation = new Regulation
            {
                Id = id,
                Title = title,
                Content = content,
                EffectiveDate = effectiveDate,
                Location = location,
                Keywords = keywords,
                SourceUrl = sourceUrl,
                Jurisdiction = jurisdiction,
                CreatedAt = createdAt,
                UpdatedAt = updatedAt
            };

            // Assert
            Assert.Equal(id, regulation.Id);
            Assert.Equal(title, regulation.Title);
            Assert.Equal(content, regulation.Content);
            Assert.Equal(effectiveDate, regulation.EffectiveDate);
            Assert.Equal(location, regulation.Location);
            Assert.Equal(keywords, regulation.Keywords);
            Assert.Equal(sourceUrl, regulation.SourceUrl);
            Assert.Equal(jurisdiction, regulation.Jurisdiction);
            Assert.Equal(createdAt, regulation.CreatedAt);
            Assert.Equal(updatedAt, regulation.UpdatedAt);
        }

        [Fact]
        public void Regulation_DefaultValuesAreSetCorrectly()
        {
            // Act
            var regulation = new Regulation();

            // Assert
            Assert.NotEqual(Guid.Empty, regulation.Id); // BaseEntity sets Id
            Assert.Null(regulation.Title);
            Assert.Null(regulation.Content);
            Assert.Equal(default(DateTime), regulation.EffectiveDate);
            Assert.Null(regulation.Location);
            Assert.Null(regulation.Keywords);
            Assert.Null(regulation.SourceUrl);
            Assert.Null(regulation.Jurisdiction);
            Assert.Equal(default(DateTime), regulation.CreatedAt);
            Assert.Equal(default(DateTime), regulation.UpdatedAt);
        }

        [Fact]
        public void Regulation_KeywordsCanBeEmpty()
        {
            // Arrange
            var regulation = new Regulation
            {
                Title = "Test",
                Content = "Content",
                Location = "Location",
                Keywords = new List<string>()
            };

            // Assert
            Assert.NotNull(regulation.Keywords);
            Assert.Empty(regulation.Keywords);
        }
    }
}
