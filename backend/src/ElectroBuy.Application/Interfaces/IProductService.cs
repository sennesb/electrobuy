using ElectroBuy.Application.DTOs.Products;

namespace ElectroBuy.Application.Interfaces;

public interface IProductService
{
    Task<ProductListDto> GetListAsync(ProductQueryDto query);
    Task<ProductDto?> GetByIdAsync(Guid id);
    Task<ProductDto> CreateAsync(CreateProductDto dto);
    Task<ProductDto?> UpdateAsync(Guid id, UpdateProductDto dto);
    Task<bool> DeleteAsync(Guid id);
    Task<IEnumerable<string>> GetBrandsAsync();
    Task<bool> ExistsAsync(Guid id);
}
