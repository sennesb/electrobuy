using System.ComponentModel.DataAnnotations;

namespace ElectroBuy.Application.DTOs.Cart;

public class AddToCartDto
{
    [Required(ErrorMessage = "产品ID是必填项")]
    public Guid ProductId { get; set; }

    [Required(ErrorMessage = "数量是必填项")]
    [Range(1, int.MaxValue, ErrorMessage = "数量必须大于0")]
    public int Quantity { get; set; } = 1;
}
