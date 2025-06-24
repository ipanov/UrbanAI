using UrbanAI.Domain.Entities;

namespace UrbanAI.Domain.Interfaces
{
    public interface IIssueRepository
    {
        Task<Issue?> GetByIdAsync(Guid id);
        Task<IEnumerable<Issue>> GetAllAsync();
        Task AddAsync(Issue issue);
        Task UpdateAsync(Issue issue);
        Task DeleteAsync(Issue issue);
    }
}
