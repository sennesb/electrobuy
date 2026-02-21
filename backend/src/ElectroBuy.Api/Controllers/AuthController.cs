using System.Security.Claims;
using ElectroBuy.Application.DTOs.Auth;
using ElectroBuy.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ElectroBuy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IUserService userService, ILogger<AuthController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        try
        {
            var result = await _userService.RegisterAsync(dto);
            _logger.LogInformation("用户注册成功: {Email}", dto.Email);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("用户注册失败: {Message}", ex.Message);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "用户注册发生错误");
            return StatusCode(500, new { message = "服务器内部错误" });
        }
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        try
        {
            var result = await _userService.LoginAsync(dto);
            _logger.LogInformation("用户登录成功: {Email}", dto.Email);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning("用户登录失败: {Message}", ex.Message);
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "用户登录发生错误");
            return StatusCode(500, new { message = "服务器内部错误" });
        }
    }

    [Authorize]
    [HttpGet("me")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetCurrentUser()
    {
        try
        {
            var userId = GetUserIdFromClaims();
            if (userId == null)
            {
                return Unauthorized(new { message = "无效的用户凭证" });
            }

            var user = await _userService.GetCurrentUserAsync(userId.Value);
            if (user == null)
            {
                return NotFound(new { message = "用户不存在" });
            }

            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "获取当前用户信息发生错误");
            return StatusCode(500, new { message = "服务器内部错误" });
        }
    }

    [Authorize]
    [HttpPut("me")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateCurrentUser([FromBody] UpdateUserDto dto)
    {
        try
        {
            var userId = GetUserIdFromClaims();
            if (userId == null)
            {
                return Unauthorized(new { message = "无效的用户凭证" });
            }

            var user = await _userService.UpdateUserAsync(userId.Value, dto);
            _logger.LogInformation("用户信息更新成功: {UserId}", userId);
            return Ok(user);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("用户信息更新失败: {Message}", ex.Message);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "用户信息更新发生错误");
            return StatusCode(500, new { message = "服务器内部错误" });
        }
    }

    [Authorize]
    [HttpPost("change-password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        try
        {
            var userId = GetUserIdFromClaims();
            if (userId == null)
            {
                return Unauthorized(new { message = "无效的用户凭证" });
            }

            await _userService.ChangePasswordAsync(userId.Value, dto);
            _logger.LogInformation("用户密码修改成功: {UserId}", userId);
            return Ok(new { message = "密码修改成功" });
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning("用户密码修改失败: {Message}", ex.Message);
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("用户密码修改失败: {Message}", ex.Message);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "用户密码修改发生错误");
            return StatusCode(500, new { message = "服务器内部错误" });
        }
    }

    private Guid? GetUserIdFromClaims()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                       ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return null;
        }

        return userId;
    }
}
