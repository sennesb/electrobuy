using ElectroBuy.Application.DTOs.Auth;

namespace ElectroBuy.Application.Interfaces;

public interface IUserService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
    Task<UserDto?> GetCurrentUserAsync(Guid userId);
    Task<bool> UserExistsAsync(string email);
}
