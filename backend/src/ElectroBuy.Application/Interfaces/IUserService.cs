using ElectroBuy.Application.DTOs.Auth;
using ElectroBuy.Application.DTOs.Users;
using AuthUserDto = ElectroBuy.Application.DTOs.Auth.UserDto;
using AdminUserDto = ElectroBuy.Application.DTOs.Users.UserDto;

namespace ElectroBuy.Application.Interfaces;

public interface IUserService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
    Task<AuthUserDto?> GetCurrentUserAsync(Guid userId);
    Task<bool> UserExistsAsync(string email);
    Task<AuthUserDto> UpdateUserAsync(Guid userId, UpdateUserDto dto);
    Task<bool> ChangePasswordAsync(Guid userId, ChangePasswordDto dto);

    Task<UserListDto> GetUsersAsync(UserQueryDto query);
    Task<AdminUserDto?> GetUserByIdAsync(Guid id);
    Task<AdminUserDto> UpdateUserByAdminAsync(Guid id, UpdateUserByAdminDto dto);
    Task<bool> ResetPasswordAsync(Guid id, ResetPasswordDto dto);
    Task<bool> ToggleUserStatusAsync(Guid id);
    Task<int> GetUserCountAsync();
}
