using System.Threading.Tasks;
using UrbanAI.Domain.Entities; // Correct using directive

namespace UrbanAI.Application.Features.Users
{
    public interface IUserService
    {
        Task<User> GetOrCreateAnonymousUserAsync(string provider, string externalId);
    }
}
