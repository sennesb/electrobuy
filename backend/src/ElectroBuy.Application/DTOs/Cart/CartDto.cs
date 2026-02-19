namespace ElectroBuy.Application.DTOs.Cart;

public class CartDto
{
    public List<CartItemDto> Items { get; set; } = new();
    public int TotalItems => Items.Sum(i => i.Quantity);
    public decimal TotalAmount => Items.Sum(i => i.Subtotal);
}
