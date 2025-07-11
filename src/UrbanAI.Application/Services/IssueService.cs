using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using UrbanAI.Application.DTOs;
using UrbanAI.Application.Interfaces;
using UrbanAI.Domain.Entities;
using UrbanAI.Domain.Interfaces;

namespace UrbanAI.Application.Services
{
    public class IssueService : IIssueService
    {
        private readonly IIssueRepository _issueRepository;
        private readonly IRegulationRepository _regulationRepository;

        public IssueService(IIssueRepository issueRepository, IRegulationRepository regulationRepository)
        {
            _issueRepository = issueRepository;
            _regulationRepository = regulationRepository;
        }

        public async Task<CreateIssueResponseDto> CreateIssueAsync(CreateIssueRequestDto request)
        {
            var issue = new Issue
            {
                Id = Guid.NewGuid(),
                Title = request.Title,
                Description = request.Description,
                PhotoUrl = request.PhotoUrl,
                Latitude = request.Latitude,
                Longitude = request.Longitude,
                CreatedAt = DateTime.UtcNow,
                Status = "Open" // Initial status
            };

            await _issueRepository.AddAsync(issue);

            var response = new CreateIssueResponseDto
            {
                Id = issue.Id,
                Description = issue.Description,
                PhotoUrl = issue.PhotoUrl,
                Latitude = issue.Latitude,
                Longitude = issue.Longitude,
                CreatedAt = issue.CreatedAt,
                Message = "Issue created successfully."
            };

            return response;
        }

        public async Task<IssueDto> GetIssueByIdAsync(Guid id)
        {
            var issue = await _issueRepository.GetByIdAsync(id);

            if (issue == null)
            {
                return null; // Or throw a specific exception
            }

            var issueDto = new IssueDto
            {
                Id = issue.Id,
                Title = issue.Title,
                Description = issue.Description,
                CreatedAt = issue.CreatedAt,
                Status = issue.Status,
                PhotoUrl = issue.PhotoUrl,
                Latitude = issue.Latitude,
                Longitude = issue.Longitude
            };

            return issueDto;
        }

        public async Task<IEnumerable<IssueDto>> GetAllIssuesAsync()
        {
            var issues = await _issueRepository.GetAllAsync();

            var issueDtos = new List<IssueDto>();
            foreach (var issue in issues)
            {
                issueDtos.Add(new IssueDto
                {
                    Id = issue.Id,
                    Title = issue.Title,
                    Description = issue.Description,
                    CreatedAt = issue.CreatedAt,
                    Status = issue.Status,
                    PhotoUrl = issue.PhotoUrl,
                    Latitude = issue.Latitude,
                    Longitude = issue.Longitude
                });
            }
            return issueDtos;
        }

        public async Task<IssueDto> UpdateIssueAsync(UpdateIssueRequestDto request)
        {
            var issue = await _issueRepository.GetByIdAsync(request.Id);
            if (issue == null)
            {
                // Handle not found, maybe throw an exception or return null
                return null; // Basic handling for now
            }

            issue.Title = request.Title;
            issue.Description = request.Description;
            issue.PhotoUrl = request.PhotoUrl;
            issue.Latitude = request.Latitude;
            issue.Longitude = request.Longitude;
            issue.Status = request.Status;

            await _issueRepository.UpdateAsync(issue);

            return new IssueDto
            {
                Id = issue.Id,
                Title = issue.Title,
                Description = issue.Description,
                PhotoUrl = issue.PhotoUrl,
                Latitude = issue.Latitude,
                Longitude = issue.Longitude,
                Status = issue.Status
            };
        }

        public async Task DeleteIssueAsync(Guid id)
        {
            var issue = await _issueRepository.GetByIdAsync(id);
            if (issue != null)
            {
                await _issueRepository.DeleteAsync(issue);
            }
        }

        public async Task<IEnumerable<UrbanAI.Domain.Entities.Regulation>> GetRegulationsByLocationAsync(string location)
        {
            // Assuming the RegulationRepository has a method to get regulations by location
            // The location parameter might need to be parsed or used differently depending on the repository implementation
            return await _regulationRepository.GetByLocationAsync(location);
        }
    }
}
