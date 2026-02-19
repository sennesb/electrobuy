namespace ElectroBuy.Domain.Entities;

public class OrderItem
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ModelNumber { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual Order Order { get; set; } = null!;
    public virtual Product Product { get; set; } = null!;
}
