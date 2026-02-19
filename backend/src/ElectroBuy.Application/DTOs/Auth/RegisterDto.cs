using System.ComponentModel.DataAnnotations;

namespace ElectroBuy.Application.DTOs.Auth;

public class RegisterDto
{
    [Required(ErrorMessage = "邮箱是必填项")]
    [EmailAddress(ErrorMessage = "邮箱格式不正确")]
    [StringLength(255, ErrorMessage = "邮箱长度不能超过255个字符")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "密码是必填项")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "密码长度必须在6-100个字符之间")]
    public string Password { get; set; } = string.Empty;

    [StringLength(100, ErrorMessage = "姓名长度不能超过100个字符")]
    public string? Name { get; set; }

    [StringLength(200, ErrorMessage = "公司名称长度不能超过200个字符")]
    public string? Company { get; set; }

    [StringLength(50, ErrorMessage = "电话长度不能超过50个字符")]
    [Phone(ErrorMessage = "电话格式不正确")]
    public string? Phone { get; set; }
}
