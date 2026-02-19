using System.ComponentModel.DataAnnotations;

namespace ElectroBuy.Application.DTOs.Auth;

public class LoginDto
{
    [Required(ErrorMessage = "邮箱是必填项")]
    [EmailAddress(ErrorMessage = "邮箱格式不正确")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "密码是必填项")]
    public string Password { get; set; } = string.Empty;
}
