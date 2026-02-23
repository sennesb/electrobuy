using System.Security.Claims;
using ElectroBuy.Application.DTOs.Users;
using ElectroBuy.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ElectroBuy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<UsersController> _logger;

    public UsersController(IUserService userService, ILogger<UsersController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    [HttpGet]
    [ProducesResponseType(typeof(UserListDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUsers([FromQuery] UserQueryDto query)
    {
        try
        {
            var result = await _userService.GetUsersAsync(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "获取用户列表发生错误");
            return StatusCode(500, new { message = "服务器内部错误" });
        }
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetUser(Guid id)
    {
        try
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "用户不存在" });
            }
            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "获取用户信息发生错误");
            return StatusCode(500, new { message = "服务器内部错误" });
        }
    }

    [HttpPut("{id}")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserByAdminDto dto)
    {
        try
        {
            var user = await _userService.UpdateUserByAdminAsync(id, dto);
            _logger.LogInformation("管理员更新用户信息成功: {UserId}", id);
            return Ok(user);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("更新用户信息失败: {Message}", ex.Message);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "更新用户信息发生错误");
            return StatusCode(500, new { message = "服务器内部错误" });
        }
    }

    [HttpPost("{id}/reset-password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ResetPassword(Guid id, [FromBody] ResetPasswordDto dto)
    {
        try
        {
            await _userService.ResetPasswordAsync(id, dto);
            _logger.LogInformation("管理员重置用户密码成功: {UserId}", id);
            return Ok(new { message = "密码重置成功" });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("重置密码失败: {Message}", ex.Message);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "重置密码发生错误");
            return StatusCode(500, new { message = "服务器内部错误" });
        }
    }

    [HttpPost("{id}/toggle-status")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ToggleStatus(Guid id)
    {
        try
        {
            var isActive = await _userService.ToggleUserStatusAsync(id);
            _logger.LogInformation("管理员切换用户状态成功: {UserId}, IsActive: {IsActive}", id, isActive);
            return Ok(new { message = isActive ? "用户已启用" : "用户已禁用", isActive });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("切换用户状态失败: {Message}", ex.Message);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "切换用户状态发生错误");
            return StatusCode(500, new { message = "服务器内部错误" });
        }
    }

    [HttpGet("count")]
    [ProducesResponseType(typeof(int), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUserCount()
    {
        try
        {
            var count = await _userService.GetUserCountAsync();
            return Ok(count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "获取用户数量发生错误");
            return StatusCode(500, new { message = "服务器内部错误" });
        }
    }
}
