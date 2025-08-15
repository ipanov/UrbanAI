using UrbanAI.Application.DTOs;
using UrbanAI.Application.Interfaces;
using UrbanAI.Domain.Entities;
using UrbanAI.Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace UrbanAI.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public UserService(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        public async Task<UserDto> CreateUserFromOAuthAsync(string provider, string externalId, string username)
        {
            var user = new User
            {
                Username = username,
                Role = "User"
            };

            var createdUser = await _userRepository.CreateAsync(user);

            var externalLogin = new ExternalLogin
            {
                Provider = provider,
                ExternalId = externalId,
                UserId = createdUser.Id,
                CreatedAt = DateTime.UtcNow
            };

            createdUser.ExternalLogins.Add(externalLogin);
            await _userRepository.UpdateAsync(createdUser);

            return new UserDto
            {
                Id = createdUser.Id,
                Username = createdUser.Username,
                Role = createdUser.Role
            };
        }

        public async Task<UserDto?> GetUserByExternalLoginAsync(string provider, string externalId)
        {
            var user = await _userRepository.GetByExternalLoginAsync(provider, externalId);
            
            if (user == null)
                return null;

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Role = user.Role
            };
        }

        public async Task<UserDto?> GetUserByIdAsync(Guid id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            
            if (user == null)
                return null;

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Role = user.Role
            };
        }

        public async Task<UserDto> UpdateUserAsync(Guid id, UserDto userDto)
        {
            var user = await _userRepository.GetByIdAsync(id);
            
            if (user == null)
                throw new ArgumentException($"User with ID {id} not found");

            user.Username = userDto.Username;
            user.Role = userDto.Role;

            var updatedUser = await _userRepository.UpdateAsync(user);

            return new UserDto
            {
                Id = updatedUser.Id,
                Username = updatedUser.Username,
                Role = updatedUser.Role
            };
        }

        public async Task<UserDto> GetOrCreateExternalUserAsync(string provider, string externalId, string username)
        {
            // Try to get existing user
            var existingUser = await GetUserByExternalLoginAsync(provider, externalId);
            
            if (existingUser != null)
                return existingUser;

            // Create new user if not found
            return await CreateUserFromOAuthAsync(provider, externalId, username);
        }

        public async Task<string> GenerateJwtTokenAsync(UserDto user)
        {
            var jwtKey = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT key not configured");
            var jwtIssuer = _configuration["Jwt:Issuer"] ?? "UrbanAI";
            var jwtAudience = _configuration["Jwt:Audience"] ?? "UrbanAI";

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
            };

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
