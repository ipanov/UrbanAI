using UrbanAI.Application.Interfaces;
using UrbanAI.Domain.Entities;
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

        public async Task<Regulation?> GetRegulationByIdAsync(string id)
        {
            // Basic implementation - delegate to repository
            var regulation = await _regulationRepository.GetByIdAsync(id);
            return regulation;
        }

        public async Task<Regulation?> GetRegulationByLocationAsync(string location)
        {
            // Basic implementation - delegate to repository
            // This will need more sophisticated logic later for actual location-based search
            var regulations = await _regulationRepository.GetByLocationAsync(location);
            return regulations?.FirstOrDefault();
        }

        // Implement other necessary methods from IRegulationService
    }
}
