using System.ComponentModel.DataAnnotations;

namespace ElectroBuy.Application.DTOs.Users;

public class UserQueryDto
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Keyword { get; set; }
    public string? Role { get; set; }
    public bool? IsActive { get; set; }
}

public class UpdateUserByAdminDto
{
    [StringLength(100, MinimumLength = 1, ErrorMessage = "姓名长度必须在1-100个字符之间")]
    public string? Name { get; set; }

    [StringLength(200, ErrorMessage = "公司名称不能超过200个字符")]
    public string? Company { get; set; }

    [StringLength(50, ErrorMessage = "联系电话不能超过50个字符")]
    public string? Phone { get; set; }

    [Required(ErrorMessage = "角色不能为空")]
    public string Role { get; set; } = string.Empty;

    public bool IsActive { get; set; }
}

public class ResetPasswordDto
{
    [Required(ErrorMessage = "新密码不能为空")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "密码长度必须在6-100个字符之间")]
    public string NewPassword { get; set; } = string.Empty;
}
