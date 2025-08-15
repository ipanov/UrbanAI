using UrbanAI.Application.DTOs;
using UrbanAI.Domain.Entities;

namespace UrbanAI.Application.Interfaces
{
    public interface IUserService
    {
        Task<UserDto> CreateUserFromOAuthAsync(string provider, string externalId, string username);
        Task<UserDto?> GetUserByExternalLoginAsync(string provider, string externalId);
        Task<UserDto?> GetUserByIdAsync(Guid id);
        Task<UserDto> UpdateUserAsync(Guid id, UserDto userDto);
        Task<UserDto> GetOrCreateExternalUserAsync(string provider, string externalId, string username);
        Task<string> GenerateJwtTokenAsync(UserDto user);
    }
}
