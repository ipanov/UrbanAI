using UrbanAI.Domain.Common;

namespace UrbanAI.Domain.Entities
{
    /// <summary>
    /// Represents the Terms of Service document.
    /// </summary>
    public class TermsOfService : BaseEntity
    {
        /// <summary>
        /// Version identifier for the terms.
        /// </summary>
        public string Version { get; set; } = string.Empty;

        /// <summary>
        /// Title of the terms document.
        /// </summary>
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// Content of the terms document.
        /// </summary>
        public string Content { get; set; } = string.Empty;

        /// <summary>
        /// When this version became effective.
        /// </summary>
        public DateTime EffectiveDate { get; set; }

        /// <summary>
        /// Whether this version is currently active.
        /// </summary>
        public bool IsActive { get; set; } = true;

        /// <summary>
        /// URL where the terms can be viewed.
        /// </summary>
        public string? Url { get; set; }
    }
}