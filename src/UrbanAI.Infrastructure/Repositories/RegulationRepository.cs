using UrbanAI.Domain.Entities;
using UrbanAI.Domain.Interfaces;
using UrbanAI.Infrastructure.Data;
using UrbanAI.Infrastructure.Data.Models;
using MongoDB.Driver;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace UrbanAI.Infrastructure.Repositories
{
    public class RegulationRepository : IRegulationRepository
    {
        private readonly MongoDbContext _context;

        public RegulationRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Regulation regulation)
        {
            var regulationDocument = new RegulationDocument
            {
                Id = regulation.Id.ToString(),
                Title = regulation.Title,
                Content = regulation.Content,
                SourceUrl = regulation.SourceUrl,
                Jurisdiction = regulation.Jurisdiction,
                Location = regulation.Location,
                EffectiveDate = regulation.EffectiveDate,
                Keywords = regulation.Keywords,
                CreatedAt = regulation.CreatedAt,
                UpdatedAt = regulation.UpdatedAt
            };
            await _context.Regulations.InsertOneAsync(regulationDocument);
        }

        public async Task<Regulation> GetByIdAsync(string id)
        {
            var regulationDocument = await _context.Regulations.Find(r => r.Id == id).FirstOrDefaultAsync();
            if (regulationDocument == null)
            {
                return null;
            }
            return new Regulation
            {
                Id = System.Guid.Parse(regulationDocument.Id),
                Title = regulationDocument.Title,
                Content = regulationDocument.Content,
                SourceUrl = regulationDocument.SourceUrl,
                Jurisdiction = regulationDocument.Jurisdiction,
                Location = regulationDocument.Location,
                EffectiveDate = regulationDocument.EffectiveDate,
                Keywords = regulationDocument.Keywords,
                CreatedAt = regulationDocument.CreatedAt,
                UpdatedAt = regulationDocument.UpdatedAt
            };
        }

        public async Task<IEnumerable<Regulation>> GetAllAsync()
        {
            var regulationDocuments = await _context.Regulations.Find(_ => true).ToListAsync();
            return regulationDocuments.Select(rd => new Regulation
            {
                Id = System.Guid.Parse(rd.Id),
                Title = rd.Title,
                Content = rd.Content,
                SourceUrl = rd.SourceUrl,
                Jurisdiction = rd.Jurisdiction,
                Location = rd.Location,
                EffectiveDate = rd.EffectiveDate,
                Keywords = rd.Keywords,
                CreatedAt = rd.CreatedAt,
                UpdatedAt = rd.UpdatedAt
            });
        }

        public async Task UpdateAsync(Regulation regulation)
        {
            var regulationDocument = new RegulationDocument
            {
                Id = regulation.Id.ToString(),
                Title = regulation.Title,
                Content = regulation.Content,
                SourceUrl = regulation.SourceUrl,
                Jurisdiction = regulation.Jurisdiction,
                Location = regulation.Location,
                EffectiveDate = regulation.EffectiveDate,
                Keywords = regulation.Keywords,
                CreatedAt = regulation.CreatedAt,
                UpdatedAt = regulation.UpdatedAt
            };
            await _context.Regulations.ReplaceOneAsync(r => r.Id == regulationDocument.Id, regulationDocument);
        }

        public async Task DeleteAsync(string id)
        {
            await _context.Regulations.DeleteOneAsync(r => r.Id == id);
        }

        public async Task<IEnumerable<Regulation>> SearchAsync(string query)
        {
            var filterBuilder = Builders<RegulationDocument>.Filter;
            // Safely check if Keywords is not null before searching within it
            var filter = filterBuilder.Where(r => r.Title.Contains(query) || r.Content.Contains(query) || (r.Keywords != null && r.Keywords.Any(k => k.Contains(query))));
            var regulationDocuments = await _context.Regulations.Find(filter).ToListAsync();
             return regulationDocuments.Select(rd => new Regulation
            {
                Id = System.Guid.Parse(rd.Id),
                Title = rd.Title,
                Content = rd.Content,
                SourceUrl = rd.SourceUrl,
                Jurisdiction = rd.Jurisdiction,
                Location = rd.Location,
                EffectiveDate = rd.EffectiveDate,
                Keywords = rd.Keywords,
                CreatedAt = rd.CreatedAt,
                UpdatedAt = rd.UpdatedAt
            });
        }

        public async Task<IEnumerable<Regulation>> GetByLocationAsync(string location)
        {
            var filter = Builders<RegulationDocument>.Filter.Eq(r => r.Location, location);
            var regulationDocuments = await _context.Regulations.Find(filter).ToListAsync();
            return regulationDocuments.Select(rd => new Regulation
            {
                Id = System.Guid.Parse(rd.Id),
                Title = rd.Title,
                Content = rd.Content,
                SourceUrl = rd.SourceUrl,
                Jurisdiction = rd.Jurisdiction,
                Location = rd.Location,
                EffectiveDate = rd.EffectiveDate,
                Keywords = rd.Keywords,
                CreatedAt = rd.CreatedAt,
                UpdatedAt = rd.UpdatedAt
            });
        }

        public async Task<IEnumerable<Regulation>> GetByKeywordsAsync(List<string> keywords)
        {
            var filter = Builders<RegulationDocument>.Filter.AnyIn(r => r.Keywords, keywords);
            var regulationDocuments = await _context.Regulations.Find(filter).ToListAsync();
            return regulationDocuments.Select(rd => new Regulation
            {
                Id = System.Guid.Parse(rd.Id),
                Title = rd.Title,
                Content = rd.Content,
                SourceUrl = rd.SourceUrl,
                Jurisdiction = rd.Jurisdiction,
                Location = rd.Location,
                EffectiveDate = rd.EffectiveDate,
                Keywords = rd.Keywords,
                CreatedAt = rd.CreatedAt,
                UpdatedAt = rd.UpdatedAt
            });
        }
    }
}
