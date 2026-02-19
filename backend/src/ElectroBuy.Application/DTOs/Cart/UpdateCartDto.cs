using System.ComponentModel.DataAnnotations;

namespace ElectroBuy.Application.DTOs.Cart;

public class UpdateCartDto
{
    [Required(ErrorMessage = "数量是必填项")]
    [Range(0, int.MaxValue, ErrorMessage = "数量不能为负数")]
    public int Quantity { get; set; }
}
