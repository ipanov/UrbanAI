using UrbanAI.Domain.Entities;

namespace UrbanAI.Domain.Interfaces
{
    public interface IRegulationRepository
    {
        Task AddAsync(Regulation regulation);
        Task<Regulation> GetByIdAsync(string id);
        Task<IEnumerable<Regulation>> GetAllAsync();
        Task UpdateAsync(Regulation regulation);
        Task DeleteAsync(string id);
        Task<IEnumerable<Regulation>> SearchAsync(string query);
        Task<IEnumerable<Regulation>> GetByLocationAsync(string location);
        Task<IEnumerable<Regulation>> GetByKeywordsAsync(List<string> keywords);
    }
}
