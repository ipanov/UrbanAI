using Moq;
using UrbanAI.Application.DTOs;
using UrbanAI.Application.Services;
using UrbanAI.Domain.Entities;
using UrbanAI.Domain.Interfaces;
using System;
using System.Threading.Tasks;

namespace UrbanAI.Application.Tests
{
    public class IssueServiceTests
    {
        private readonly Mock<IIssueRepository> _mockIssueRepository;
        private readonly Mock<IRegulationRepository> _mockRegulationRepository;
        private readonly IssueService _issueService;

        public IssueServiceTests()
        {
            _mockIssueRepository = new Mock<IIssueRepository>();
            _mockRegulationRepository = new Mock<IRegulationRepository>();
            _issueService = new IssueService(_mockIssueRepository.Object, _mockRegulationRepository.Object);
        }

        [Fact]
        public async Task CreateIssueAsync_ShouldReturnCreatedIssueDto_WhenIssueIsCreatedSuccessfully()
        {
            // Arrange
            var request = new CreateIssueRequestDto
            {
                Description = "This is a test issue.",
                PhotoUrl = "http://example.com/photo.jpg",
                Latitude = 10.0,
                Longitude = 20.0,
                Location = "Test Location",
                Title = "Test Issue"
            };

            _mockIssueRepository.Setup(repo => repo.AddAsync(It.IsAny<Issue>()))
                                .Returns(Task.CompletedTask);

            // Act
            var result = await _issueService.CreateIssueAsync(request);

            // Assert
            Assert.NotNull(result);
            Assert.NotEqual(Guid.Empty, result.Id);
            Assert.Equal(request.Description, result.Description);
            Assert.Equal(request.PhotoUrl, result.PhotoUrl);
            Assert.Equal(request.Latitude, result.Latitude);
            Assert.Equal(request.Longitude, result.Longitude);
            Assert.Equal("Issue created successfully.", result.Message);
            _mockIssueRepository.Verify(repo => repo.AddAsync(It.IsAny<Issue>()), Times.Once);
        }

        [Fact]
        public async Task GetIssueByIdAsync_ShouldReturnIssueDto_WhenIssueExists()
        {
            // Arrange
            var issueId = Guid.NewGuid();
            var mockIssue = new Issue
            {
                Id = issueId,
                Title = "Existing Issue",
                Description = "Description of existing issue",
                PhotoUrl = "http://example.com/existing.jpg",
                Latitude = 30.0,
                Longitude = 40.0,
                CreatedAt = DateTime.UtcNow,
                Status = "Open"
            };

            _mockIssueRepository.Setup(repo => repo.GetByIdAsync(issueId))
                                .ReturnsAsync(mockIssue);

            // Act
            var result = await _issueService.GetIssueByIdAsync(issueId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(mockIssue.Id, result.Id);
            Assert.Equal(mockIssue.Title, result.Title);
            Assert.Equal(mockIssue.Description, result.Description);
            Assert.Equal(mockIssue.CreatedAt, result.CreatedAt);
            Assert.Equal(mockIssue.Status, result.Status);
            Assert.Equal(mockIssue.PhotoUrl, result.PhotoUrl);
            Assert.Equal(mockIssue.Latitude, result.Latitude);
            Assert.Equal(mockIssue.Longitude, result.Longitude);
            _mockIssueRepository.Verify(repo => repo.GetByIdAsync(issueId), Times.Once);
        }

        [Fact]
        public async Task GetIssueByIdAsync_ShouldReturnNull_WhenIssueDoesNotExist()
        {
            // Arrange
            var issueId = Guid.NewGuid();
            _mockIssueRepository.Setup(repo => repo.GetByIdAsync(issueId))
                                .ReturnsAsync((Issue)null);

            // Act
            var result = await _issueService.GetIssueByIdAsync(issueId);

            // Assert
            Assert.Null(result);
            _mockIssueRepository.Verify(repo => repo.GetByIdAsync(issueId), Times.Once);
        }

        [Fact]
        public async Task GetAllIssuesAsync_ShouldReturnListOfIssueDtos()
        {
            // Arrange
            var mockIssues = new List<Issue>
            {
                new Issue { Id = Guid.NewGuid(), Title = "Issue 1", Description = "Desc 1", PhotoUrl = "url1", Latitude = 0, Longitude = 0, CreatedAt = DateTime.UtcNow, Status = "Open" },
                new Issue { Id = Guid.NewGuid(), Title = "Issue 2", Description = "Desc 2", PhotoUrl = "url2", Latitude = 0, Longitude = 0, CreatedAt = DateTime.UtcNow, Status = "Closed" }
            };

            _mockIssueRepository.Setup(repo => repo.GetAllAsync())
                                .ReturnsAsync(mockIssues);

            // Act
            var result = await _issueService.GetAllIssuesAsync();

            // Assert
            Assert.NotNull(result);
            var issueDtos = Assert.IsAssignableFrom<IEnumerable<IssueDto>>(result);
            Assert.Equal(2, issueDtos.Count());
            _mockIssueRepository.Verify(repo => repo.GetAllAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateIssueAsync_ShouldReturnUpdatedIssueDto_WhenIssueExists()
        {
            // Arrange
            var issueId = Guid.NewGuid();
            var existingIssue = new Issue
            {
                Id = issueId,
                Title = "Old Title",
                Description = "Old Description",
                PhotoUrl = "old.jpg",
                Latitude = 1.0,
                Longitude = 2.0,
                Status = "Open",
                CreatedAt = DateTime.UtcNow
            };
            var request = new UpdateIssueRequestDto
            {
                Id = issueId,
                Title = "New Title",
                Description = "New Description",
                PhotoUrl = "new.jpg",
                Latitude = 10.0,
                Longitude = 20.0,
                Status = "Closed",
                Location = "New Location"
            };

            _mockIssueRepository.Setup(repo => repo.GetByIdAsync(issueId))
                                .ReturnsAsync(existingIssue);
            _mockIssueRepository.Setup(repo => repo.UpdateAsync(It.IsAny<Issue>()))
                                .Returns(Task.CompletedTask);

            // Act
            var result = await _issueService.UpdateIssueAsync(request);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(request.Id, result.Id);
            Assert.Equal(request.Title, result.Title);
            Assert.Equal(request.Description, result.Description);
            Assert.Equal(request.PhotoUrl, result.PhotoUrl);
            Assert.Equal(request.Latitude, result.Latitude);
            Assert.Equal(request.Longitude, result.Longitude);
            Assert.Equal(request.Status, result.Status);
            Assert.Equal(request.Location, request.Location);
            _mockIssueRepository.Verify(repo => repo.GetByIdAsync(issueId), Times.Once);
            _mockIssueRepository.Verify(repo => repo.UpdateAsync(It.Is<Issue>(i => i.Id == issueId && i.Title == request.Title)), Times.Once);
        }

        [Fact]
        public async Task UpdateIssueAsync_ShouldReturnNull_WhenIssueDoesNotExist()
        {
            // Arrange
            var request = new UpdateIssueRequestDto
            {
                Id = Guid.NewGuid(),
                Title = "Non Existent",
                Description = "Non Existent",
                PhotoUrl = "http://example.com/nonexistent.jpg",
                Latitude = 0.0,
                Longitude = 0.0,
                Status = "Open",
                Location = "NonExistentLocation"
            };

            _mockIssueRepository.Setup(repo => repo.GetByIdAsync(request.Id))
                                .ReturnsAsync((Issue)null);

            // Act
            var result = await _issueService.UpdateIssueAsync(request);

            // Assert
            Assert.Null(result);
            _mockIssueRepository.Verify(repo => repo.GetByIdAsync(request.Id), Times.Once);
            _mockIssueRepository.Verify(repo => repo.UpdateAsync(It.IsAny<Issue>()), Times.Never);
        }

        [Fact]
        public async Task DeleteIssueAsync_ShouldCallDelete_WhenIssueExists()
        {
            // Arrange
            var issueId = Guid.NewGuid();
            var mockIssue = new Issue { Id = issueId, Title = "Issue to Delete", Description = "Desc", PhotoUrl = "url", Status = "Open", CreatedAt = DateTime.UtcNow };

            _mockIssueRepository.Setup(repo => repo.GetByIdAsync(issueId))
                                .ReturnsAsync(mockIssue);
            _mockIssueRepository.Setup(repo => repo.DeleteAsync(mockIssue))
                                .Returns(Task.CompletedTask);

            // Act
            await _issueService.DeleteIssueAsync(issueId);

            // Assert
            _mockIssueRepository.Verify(repo => repo.GetByIdAsync(issueId), Times.Once);
            _mockIssueRepository.Verify(repo => repo.DeleteAsync(mockIssue), Times.Once);
        }

        [Fact]
        public async Task DeleteIssueAsync_ShouldThrowInvalidOperationException_WhenIssueDoesNotExist()
        {
            // Arrange
            var issueId = Guid.NewGuid();
            _mockIssueRepository.Setup(repo => repo.GetByIdAsync(issueId))
                                .ReturnsAsync((Issue)null);

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() => _issueService.DeleteIssueAsync(issueId));

            // Verify
            _mockIssueRepository.Verify(repo => repo.GetByIdAsync(issueId), Times.Once);
            _mockIssueRepository.Verify(repo => repo.DeleteAsync(It.IsAny<Issue>()), Times.Never);
        }

        [Fact]
        public async Task GetRegulationsByLocationAsync_ShouldReturnRegulations()
        {
            // Arrange
            var location = "TestLocation";
            var mockRegulations = new List<Regulation>
            {
                new Regulation {
                    Id = Guid.NewGuid(),
                    Title = "Reg 1",
                    Content = "Content 1",
                    Location = "TestLocation",
                    Keywords = new List<string>(),
                    SourceUrl = "http://example.com",
                    Jurisdiction = "Test Jurisdiction",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Regulation {
                    Id = Guid.NewGuid(),
                    Title = "Reg 2",
                    Content = "Content 2",
                    Location = "TestLocation",
                    Keywords = new List<string>(),
                    SourceUrl = "http://example.com",
                    Jurisdiction = "Test Jurisdiction",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            };

            _mockRegulationRepository.Setup(repo => repo.GetByLocationAsync(location))
                                     .ReturnsAsync(mockRegulations);

            // Act
            var result = await _issueService.GetRegulationsByLocationAsync(location);

            // Assert
            Assert.NotNull(result);
            var regulations = Assert.IsAssignableFrom<IEnumerable<Regulation>>(result);
            Assert.Equal(2, regulations.Count());
            _mockRegulationRepository.Verify(repo => repo.GetByLocationAsync(location), Times.Once);
        }

        [Fact]
        public async Task GetRegulationsByLocationAsync_ShouldReturnEmptyList_WhenNoRegulationsFound()
        {
            // Arrange
            var location = "NonExistentLocation";
            _mockRegulationRepository.Setup(repo => repo.GetByLocationAsync(location))
                                     .ReturnsAsync(new List<Regulation>());

            // Act
            var result = await _issueService.GetRegulationsByLocationAsync(location);

            // Assert
            Assert.NotNull(result);
            var regulations = Assert.IsAssignableFrom<IEnumerable<Regulation>>(result);
            Assert.Empty(regulations);
            _mockRegulationRepository.Verify(repo => repo.GetByLocationAsync(location), Times.Once);
        }
    }
}
