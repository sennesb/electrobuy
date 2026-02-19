using System.ComponentModel.DataAnnotations;

namespace ElectroBuy.Application.DTOs.Orders;

public class CreateOrderDto
{
    [StringLength(500, ErrorMessage = "备注长度不能超过500个字符")]
    public string? Remark { get; set; }
}
