using System.ComponentModel.DataAnnotations;

namespace ElectroBuy.Application.DTOs.Products;

public class UpdateProductDto
{
    [Required(ErrorMessage = "产品名称是必填项")]
    [StringLength(200, ErrorMessage = "产品名称长度不能超过200个字符")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "型号是必填项")]
    [StringLength(100, ErrorMessage = "型号长度不能超过100个字符")]
    public string ModelNumber { get; set; } = string.Empty;

    [Required(ErrorMessage = "分类是必填项")]
    public int CategoryId { get; set; }

    [Required(ErrorMessage = "品牌是必填项")]
    [StringLength(100, ErrorMessage = "品牌长度不能超过100个字符")]
    public string Brand { get; set; } = string.Empty;

    [Required(ErrorMessage = "价格是必填项")]
    [Range(0.01, double.MaxValue, ErrorMessage = "价格必须大于0")]
    public decimal Price { get; set; }

    [StringLength(20, ErrorMessage = "单位长度不能超过20个字符")]
    public string Unit { get; set; } = "件";

    [Range(0, int.MaxValue, ErrorMessage = "库存不能为负数")]
    public int Stock { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "最小起订量必须大于0")]
    public int MinOrderQty { get; set; }

    public string? Specs { get; set; }

    public string? Description { get; set; }

    public List<string>? Images { get; set; }

    public bool IsActive { get; set; }
}
