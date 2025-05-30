using System.Threading.Tasks;
using UrbanAI.Domain.Entities;

namespace UrbanAI.Application.Interfaces
{
    public interface IRegulationService
    {
        Task<Regulation> GetRegulationByIdAsync(string id);
        Task<Regulation> GetRegulationByLocationAsync(string location);
        // Add other necessary methods for regulation management
    }
}
