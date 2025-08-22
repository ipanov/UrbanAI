namespace UrbanAI.Domain.Interfaces
{
    public interface ICloudDatabaseConfig
    {
        string ConnectionString { get; }
        string Provider { get; }
        Dictionary<string, string> Settings { get; }
    }
}
