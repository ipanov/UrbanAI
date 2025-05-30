using System.Collections.Generic;
using System.Threading.Tasks;
using UrbanAI.Domain.Entities;

namespace UrbanAI.Application.Features.Issues
{
    public interface IIssueService
    {
        Task<IEnumerable<Issue>> GetIssuesAsync(string userId);
        Task<Issue> GetIssueAsync(int id, string userId);
        Task<Issue> CreateIssueAsync(Issue issue, string userId);
        Task UpdateIssueAsync(Issue issue, string userId);
        Task DeleteIssueAsync(int id, string userId);
    }
}
