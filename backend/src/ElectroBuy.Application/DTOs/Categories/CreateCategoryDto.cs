using System.ComponentModel.DataAnnotations;

namespace ElectroBuy.Application.DTOs.Categories;

public class CreateCategoryDto
{
    [Required(ErrorMessage = "分类名称是必填项")]
    [StringLength(100, ErrorMessage = "分类名称长度不能超过100个字符")]
    public string Name { get; set; } = string.Empty;

    public int? ParentId { get; set; }

    [StringLength(500, ErrorMessage = "描述长度不能超过500个字符")]
    public string? Description { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "排序值必须大于或等于0")]
    public int SortOrder { get; set; } = 0;
}
