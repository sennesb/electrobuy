namespace ElectroBuy.Domain.Entities;

public class CartItem
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public virtual User User { get; set; } = null!;
    public virtual Product Product { get; set; } = null!;
}
