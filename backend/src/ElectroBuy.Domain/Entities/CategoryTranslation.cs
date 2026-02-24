namespace ElectroBuy.Domain.Entities;

public class CategoryTranslation
{
    public Guid Id { get; set; }
    public int CategoryId { get; set; }
    public string Language { get; set; } = "en";
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    public Category Category { get; set; } = null!;
}
