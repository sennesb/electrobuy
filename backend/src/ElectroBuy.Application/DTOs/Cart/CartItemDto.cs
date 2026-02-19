namespace ElectroBuy.Application.DTOs.Cart;

public class CartItemDto
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ModelNumber { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Unit { get; set; } = "件";
    public int Quantity { get; set; }
    public decimal Subtotal => Price * Quantity;
    public int Stock { get; set; }
    public string? Image { get; set; }
    public bool IsActive { get; set; }
}
