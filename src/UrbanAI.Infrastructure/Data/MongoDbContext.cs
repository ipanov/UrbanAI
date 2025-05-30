using Microsoft.Extensions.Options;
using MongoDB.Driver;
using UrbanAI.Infrastructure.Data.Models;

namespace UrbanAI.Infrastructure.Data
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        public MongoDbContext(IOptions<MongoDbSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            _database = client.GetDatabase(settings.Value.DatabaseName);
        }

        public IMongoCollection<RegulationDocument> Regulations => _database.GetCollection<RegulationDocument>("Regulations");
    }
}
