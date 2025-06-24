using Xunit;
using UrbanAI.Infrastructure.Data;

namespace UrbanAI.Infrastructure.Tests
{
    public class MongoDbSettingsTests
    {
        [Fact]
        public void MongoDbSettings_ShouldSetConnectionString()
        {
            // Arrange
            var settings = new MongoDbSettings();
            var expectedConnectionString = "mongodb://localhost:27017";

            // Act
            settings.ConnectionString = expectedConnectionString;

            // Assert
            Assert.Equal(expectedConnectionString, settings.ConnectionString);
        }

        [Fact]
        public void MongoDbSettings_ShouldSetDatabaseName()
        {
            // Arrange
            var settings = new MongoDbSettings();
            var expectedDatabaseName = "UrbanAITestDb";

            // Act
            settings.DatabaseName = expectedDatabaseName;

            // Assert
            Assert.Equal(expectedDatabaseName, settings.DatabaseName);
        }

        [Fact]
        public void MongoDbSettings_ShouldSetBothProperties()
        {
            // Arrange
            var settings = new MongoDbSettings();
            var expectedConnectionString = "mongodb://localhost:27017";
            var expectedDatabaseName = "UrbanAITestDb";

            // Act
            settings.ConnectionString = expectedConnectionString;
            settings.DatabaseName = expectedDatabaseName;

            // Assert
            Assert.Equal(expectedConnectionString, settings.ConnectionString);
            Assert.Equal(expectedDatabaseName, settings.DatabaseName);
        }

        [Fact]
        public void MongoDbSettings_DefaultValues_ShouldBeNull()
        {
            // Arrange & Act
            var settings = new MongoDbSettings();

            // Assert
            Assert.Null(settings.ConnectionString);
            Assert.Null(settings.DatabaseName);
        }

        [Fact]
        public void MongoDbSettings_ShouldAcceptEmptyValues()
        {
            // Arrange
            var settings = new MongoDbSettings();

            // Act
            settings.ConnectionString = string.Empty;
            settings.DatabaseName = string.Empty;

            // Assert
            Assert.Equal(string.Empty, settings.ConnectionString);
            Assert.Equal(string.Empty, settings.DatabaseName);
        }
    }
}
