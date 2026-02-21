using System.ComponentModel.DataAnnotations;

namespace ElectroBuy.Application.DTOs.Auth;

public class UpdateUserDto
{
    [StringLength(50, ErrorMessage = "姓名长度不能超过50个字符")]
    public string? Name { get; set; }

    [StringLength(100, ErrorMessage = "公司名称长度不能超过100个字符")]
    public string? Company { get; set; }

    [Phone(ErrorMessage = "请输入有效的电话号码")]
    [StringLength(20, ErrorMessage = "电话号码长度不能超过20个字符")]
    public string? Phone { get; set; }
}
