using Moq;
using UrbanAI.Application.Services;
using UrbanAI.Domain.Interfaces;
using UrbanAI.Domain.Entities;

namespace UrbanAI.Application.Tests
{
    public class RegulationServiceTests
    {
        private readonly Mock<IRegulationRepository> _mockRegulationRepository;
        private readonly RegulationService _regulationService;

        public RegulationServiceTests()
        {
            _mockRegulationRepository = new Mock<IRegulationRepository>();
            _regulationService = new RegulationService(_mockRegulationRepository.Object);
        }

        [Fact]
        public async Task GetRegulationByIdAsync_ShouldCallRepository()
        {
            // Arrange
            var id = "regulation-123";
            var regulation = new Regulation { 
                Id = Guid.NewGuid(), 
                Title = "Test Regulation",
                Content = "Test Content",
                Location = "Test Location",
                Keywords = new List<string>(),
                SourceUrl = "http://example.com",
                Jurisdiction = "Test Jurisdiction"
            };
            _mockRegulationRepository.Setup(repo => repo.GetByIdAsync(id))
                                     .ReturnsAsync(regulation);

            // Act
            var result = await _regulationService.GetRegulationByIdAsync(id);

            // Assert
            Assert.Equal(regulation, result);
            _mockRegulationRepository.Verify(repo => repo.GetByIdAsync(id), Times.Once);
        }

        [Fact]
        public async Task GetRegulationByLocationAsync_ShouldReturnFirstRegulation()
        {
            // Arrange
            var location = "New York";
            var regulations = new List<Regulation>
            {
                new Regulation { 
                    Id = Guid.NewGuid(), 
                    Title = "Regulation 1", 
                    Content = "Test Content 1",
                    Location = location,
                    Keywords = new List<string>(),
                    SourceUrl = "http://example.com",
                    Jurisdiction = "Test Jurisdiction"
                },
                new Regulation { 
                    Id = Guid.NewGuid(), 
                    Title = "Regulation 2", 
                    Content = "Test Content 2",
                    Location = location,
                    Keywords = new List<string>(),
                    SourceUrl = "http://example.com",
                    Jurisdiction = "Test Jurisdiction"
                }
            };
            _mockRegulationRepository.Setup(repo => repo.GetByLocationAsync(location))
                                     .ReturnsAsync(regulations);

            // Act
            var result = await _regulationService.GetRegulationByLocationAsync(location);

            // Assert
            Assert.Equal(regulations[0], result);
            _mockRegulationRepository.Verify(repo => repo.GetByLocationAsync(location), Times.Once);
        }
    }
}
