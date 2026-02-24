namespace ElectroBuy.Domain.Entities;

public class ProductTranslation
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string Language { get; set; } = "en";
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Specifications { get; set; }

    public Product Product { get; set; } = null!;
}
