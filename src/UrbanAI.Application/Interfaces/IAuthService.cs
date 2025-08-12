using UrbanAI.Application.DTOs;

namespace UrbanAI.Application.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(AuthRequestDto request);
        Task<AuthResponseDto> LoginAsync(AuthRequestDto request);
        Task<AuthResponseDto> ExchangeTokenAsync(AuthRequestDto request);
    }
}
