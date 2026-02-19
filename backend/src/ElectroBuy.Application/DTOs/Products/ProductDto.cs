namespace ElectroBuy.Application.DTOs.Products;

public class ProductDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ModelNumber { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public string Brand { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Unit { get; set; } = "件";
    public int Stock { get; set; }
    public int MinOrderQty { get; set; }
    public string? Specs { get; set; }
    public string? Description { get; set; }
    public List<string>? Images { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
