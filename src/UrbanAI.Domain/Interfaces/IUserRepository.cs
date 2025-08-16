using UrbanAI.Domain.Entities;

namespace UrbanAI.Domain.Interfaces
{
    public interface IUserRepository
    {
        Task<User> CreateAsync(User user);
        Task<User?> GetByIdAsync(Guid id);
        Task<User?> GetByExternalLoginAsync(string provider, string externalId);
        Task<User> UpdateAsync(User user);
        Task DeleteAsync(Guid id);
        Task<IEnumerable<User>> GetAllAsync();
    }
}
