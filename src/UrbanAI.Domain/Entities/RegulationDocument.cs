using System.Text.Json;

namespace UrbanAI.Domain.Entities
{
    public class RegulationDocument
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public JsonDocument? Metadata { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string[] Tags { get; set; } = Array.Empty<string>();
        public Vector? Embedding { get; set; }
    }

    public class Vector
    {
        public float[] Values { get; set; } = Array.Empty<float>();

        public Vector() { }

        public Vector(float[] values)
        {
            Values = values;
        }

        public static Vector FromArray(float[] values)
        {
            return new Vector(values);
        }
    }
}
