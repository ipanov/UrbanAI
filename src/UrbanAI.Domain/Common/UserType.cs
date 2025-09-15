using System.ComponentModel;

namespace UrbanAI.Domain.Common
{
    /// <summary>
    /// Represents the different types of users in the UrbanAI system.
    /// Each type has specific permissions and capabilities within the platform.
    /// </summary>
    public enum UserType
    {
        /// <summary>
        /// Regular citizens who can report issues and track their progress.
        /// Default user type for new registrations.
        /// Permissions: Create issues, view own issues, receive status updates.
        /// </summary>
        [Description("Citizen")]
        Citizen = 1,

        /// <summary>
        /// Investors who can view and analyze urban development data.
        /// Permissions: View aggregated data, access reports, analyze trends.
        /// </summary>
        [Description("Investor")]
        Investor = 2,

        /// <summary>
        /// Municipal authorities who can manage and resolve reported issues.
        /// Permissions: View all issues, update issue status, manage assignments, access regulatory documents.
        /// </summary>
        [Description("Authority")]
        Authority = 3
    }

    /// <summary>
    /// Extension methods for UserType enum
    /// </summary>
    public static class UserTypeExtensions
    {
        /// <summary>
        /// Gets the display name for the UserType
        /// </summary>
        /// <param name="userType">The user type</param>
        /// <returns>The display name</returns>
        public static string GetDisplayName(this UserType userType)
        {
            var fieldInfo = userType.GetType().GetField(userType.ToString());
            var descriptionAttribute = fieldInfo?.GetCustomAttributes(typeof(DescriptionAttribute), false)
                .FirstOrDefault() as DescriptionAttribute;

            return descriptionAttribute?.Description ?? userType.ToString();
        }

        /// <summary>
        /// Determines if the user type has administrative privileges
        /// </summary>
        /// <param name="userType">The user type</param>
        /// <returns>True if the user type has admin privileges</returns>
        public static bool IsAdministrative(this UserType userType)
        {
            return userType == UserType.Authority;
        }

        /// <summary>
        /// Determines if the user type can create issues
        /// </summary>
        /// <param name="userType">The user type</param>
        /// <returns>True if the user type can create issues</returns>
        public static bool CanCreateIssues(this UserType userType)
        {
            return userType == UserType.Citizen || userType == UserType.Authority;
        }

        /// <summary>
        /// Determines if the user type can view all issues
        /// </summary>
        /// <param name="userType">The user type</param>
        /// <returns>True if the user type can view all issues</returns>
        public static bool CanViewAllIssues(this UserType userType)
        {
            return userType == UserType.Authority || userType == UserType.Investor;
        }
    }
}