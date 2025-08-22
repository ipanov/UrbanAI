using Microsoft.EntityFrameworkCore;
using UrbanAI.Domain.Entities;
using UrbanAI.Domain.Interfaces;
using UrbanAI.Infrastructure.Data;

namespace UrbanAI.Infrastructure.Repositories
{
    public class RegulationRepository : IRegulationRepository
    {
        private readonly ApplicationDbContext _context;

        public RegulationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Regulation regulation)
        {
            await _context.Regulations.AddAsync(regulation);
            await _context.SaveChangesAsync();
        }

        public async Task<Regulation?> GetByIdAsync(string id)
        {
            return await _context.Regulations
                .FirstOrDefaultAsync(r => r.Id.ToString() == id);
        }

        public async Task<IEnumerable<Regulation>> GetAllAsync()
        {
            return await _context.Regulations.ToListAsync();
        }

        public async Task UpdateAsync(Regulation regulation)
        {
            _context.Regulations.Update(regulation);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(string id)
        {
            var regulation = await _context.Regulations
                .FirstOrDefaultAsync(r => r.Id.ToString() == id);
            if (regulation != null)
            {
                _context.Regulations.Remove(regulation);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Regulation>> SearchAsync(string query)
        {
            return await _context.Regulations
                .Where(r => r.Title.Contains(query) || 
                           r.Content.Contains(query) || 
                           r.Keywords.Any(k => k.Contains(query)))
                .ToListAsync();
        }

        public async Task<IEnumerable<Regulation>> GetByLocationAsync(string location)
        {
            return await _context.Regulations
                .Where(r => r.Location == location)
                .ToListAsync();
        }

        public async Task<IEnumerable<Regulation>> GetByKeywordsAsync(List<string> keywords)
        {
            return await _context.Regulations
                .Where(r => r.Keywords.Any(k => keywords.Contains(k)))
                .ToListAsync();
        }
    }
}
