namespace ElectroBuy.Domain.Entities;

public class Product
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ModelNumber { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public string Brand { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Unit { get; set; } = "件";
    public int Stock { get; set; }
    public int MinOrderQty { get; set; } = 1;
    public string? Specs { get; set; }
    public string? Description { get; set; }
    public string? Images { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public virtual Category Category { get; set; } = null!;
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    public virtual ICollection<ProductTranslation> Translations { get; set; } = new List<ProductTranslation>();
}
