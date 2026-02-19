using System.ComponentModel.DataAnnotations;

namespace ElectroBuy.Application.DTOs.Orders;

public class OrderQueryDto
{
    [Range(1, int.MaxValue, ErrorMessage = "页码必须大于0")]
    public int Page { get; set; } = 1;

    [Range(1, 100, ErrorMessage = "每页数量必须在1-100之间")]
    public int PageSize { get; set; } = 10;

    public int? Status { get; set; }
}
