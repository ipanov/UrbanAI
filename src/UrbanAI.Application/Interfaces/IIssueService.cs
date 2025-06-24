using UrbanAI.Application.DTOs;

namespace UrbanAI.Application.Interfaces
{
    public interface IIssueService
    {
        Task<CreateIssueResponseDto> CreateIssueAsync(CreateIssueRequestDto request);
        Task<IssueDto> GetIssueByIdAsync(Guid id);
        Task<IEnumerable<IssueDto>> GetAllIssuesAsync();
        Task<IssueDto> UpdateIssueAsync(UpdateIssueRequestDto request);
        Task DeleteIssueAsync(Guid id);
        Task<IEnumerable<UrbanAI.Domain.Entities.Regulation>> GetRegulationsByLocationAsync(string location);
    }
}
