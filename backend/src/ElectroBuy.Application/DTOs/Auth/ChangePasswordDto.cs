using System.ComponentModel.DataAnnotations;

namespace ElectroBuy.Application.DTOs.Auth;

public class ChangePasswordDto
{
    [Required(ErrorMessage = "请输入当前密码")]
    public string CurrentPassword { get; set; } = string.Empty;

    [Required(ErrorMessage = "请输入新密码")]
    [MinLength(6, ErrorMessage = "密码至少6个字符")]
    [MaxLength(50, ErrorMessage = "密码长度不能超过50个字符")]
    public string NewPassword { get; set; } = string.Empty;

    [Required(ErrorMessage = "请确认新密码")]
    [Compare("NewPassword", ErrorMessage = "两次输入的密码不一致")]
    public string ConfirmPassword { get; set; } = string.Empty;
}
