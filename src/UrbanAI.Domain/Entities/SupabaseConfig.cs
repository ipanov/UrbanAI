using UrbanAI.Domain.Interfaces;

namespace UrbanAI.Domain.Entities
{
    public class SupabaseConfig : ICloudDatabaseConfig
    {
        public string ConnectionString { get; set; } = string.Empty;
        public string Provider { get; set; } = "Supabase";
        public Dictionary<string, string> Settings { get; set; } = new();

        public SupabaseConfig()
        {
            Settings = new Dictionary<string, string>();
        }

        public static SupabaseConfig FromConnectionString(string connectionString)
        {
            var config = new SupabaseConfig();
            config.ConnectionString = connectionString;
            
            // Parse connection string to extract settings
            // Format: postgresql://user:password@host:port/database?options
            var uri = new Uri(connectionString);
            var query = System.Web.HttpUtility.ParseQueryString(uri.Query);
            
            config.Settings["Host"] = uri.Host;
            config.Settings["Port"] = uri.Port.ToString();
            config.Settings["Database"] = uri.AbsolutePath.TrimStart('/');
            config.Settings["Username"] = uri.UserInfo.Split(':')[0];
            config.Settings["Password"] = uri.UserInfo.Split(':').Length > 1 ? uri.UserInfo.Split(':')[1] : "";
            
            foreach (string key in query.Keys)
            {
                config.Settings[key] = query[key];
            }
            
            return config;
        }
    }
}
