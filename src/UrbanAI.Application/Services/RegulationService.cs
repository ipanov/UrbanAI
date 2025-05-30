using System.Threading.Tasks;
using UrbanAI.Application.Interfaces;
using UrbanAI.Domain.Entities;
using System.Linq;
using UrbanAI.Domain.Interfaces;

namespace UrbanAI.Application.Services
{
    public class RegulationService : IRegulationService
    {
        private readonly IRegulationRepository _regulationRepository;

        public RegulationService(IRegulationRepository regulationRepository)
        {
            _regulationRepository = regulationRepository;
        }

        public async Task<Regulation> GetRegulationByIdAsync(string id)
        {
            // Basic implementation - delegate to repository
            return await _regulationRepository.GetByIdAsync(id);
        }

        public async Task<Regulation> GetRegulationByLocationAsync(string location)
        {
            // Basic implementation - delegate to repository
            // This will need more sophisticated logic later for actual location-based search
            return (await _regulationRepository.GetByLocationAsync(location)).FirstOrDefault();
        }

        // Implement other necessary methods from IRegulationService
    }
}
