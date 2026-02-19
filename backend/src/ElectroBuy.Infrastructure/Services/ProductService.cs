using System.Text.Json;
using ElectroBuy.Application.DTOs.Products;
using ElectroBuy.Application.Interfaces;
using ElectroBuy.Domain.Entities;
using ElectroBuy.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ElectroBuy.Infrastructure.Services;

public class ProductService : IProductService
{
    private readonly ElectroBuyDbContext _context;

    public ProductService(ElectroBuyDbContext context)
    {
        _context = context;
    }

    public async Task<ProductListDto> GetListAsync(ProductQueryDto query)
    {
        var products = _context.Products
            .Include(p => p.Category)
            .AsQueryable();

        if (query.CategoryId.HasValue)
        {
            products = products.Where(p => p.CategoryId == query.CategoryId.Value);
        }

        if (!string.IsNullOrWhiteSpace(query.Keyword))
        {
            var keyword = query.Keyword.Trim().ToLower();
            products = products.Where(p =>
                p.Name.ToLower().Contains(keyword) ||
                p.ModelNumber.ToLower().Contains(keyword) ||
                p.Brand.ToLower().Contains(keyword));
        }

        if (!string.IsNullOrWhiteSpace(query.Brand))
        {
            products = products.Where(p => p.Brand == query.Brand);
        }

        if (query.MinPrice.HasValue)
        {
            products = products.Where(p => p.Price >= query.MinPrice.Value);
        }

        if (query.MaxPrice.HasValue)
        {
            products = products.Where(p => p.Price <= query.MaxPrice.Value);
        }

        if (query.IsActive.HasValue)
        {
            products = products.Where(p => p.IsActive == query.IsActive.Value);
        }

        var total = await products.CountAsync();

        products = query.SortBy?.ToLower() switch
        {
            "price" => query.SortDescending
                ? products.OrderByDescending(p => p.Price)
                : products.OrderBy(p => p.Price),
            "name" => query.SortDescending
                ? products.OrderByDescending(p => p.Name)
                : products.OrderBy(p => p.Name),
            "createdat" => query.SortDescending
                ? products.OrderByDescending(p => p.CreatedAt)
                : products.OrderBy(p => p.CreatedAt),
            "stock" => query.SortDescending
                ? products.OrderByDescending(p => p.Stock)
                : products.OrderBy(p => p.Stock),
            _ => products.OrderByDescending(p => p.CreatedAt)
        };

        var pageSize = Math.Max(1, Math.Min(query.PageSize, 100));
        var page = Math.Max(1, query.Page);

        var items = await products
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new ProductListDto
        {
            Data = items.Select(MapToDto).ToList(),
            Total = total,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<ProductDto?> GetByIdAsync(Guid id)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id);

        return product != null ? MapToDto(product) : null;
    }

    public async Task<ProductDto> CreateAsync(CreateProductDto dto)
    {
        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == dto.CategoryId);
        if (!categoryExists)
        {
            throw new InvalidOperationException("分类不存在");
        }

        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = dto.Name.Trim(),
            ModelNumber = dto.ModelNumber.Trim(),
            CategoryId = dto.CategoryId,
            Brand = dto.Brand.Trim(),
            Price = dto.Price,
            Unit = dto.Unit?.Trim() ?? "件",
            Stock = dto.Stock,
            MinOrderQty = dto.MinOrderQty,
            Specs = dto.Specs?.Trim(),
            Description = dto.Description?.Trim(),
            Images = dto.Images != null && dto.Images.Any()
                ? JsonSerializer.Serialize(dto.Images)
                : null,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(product.Id) ?? throw new InvalidOperationException("创建产品失败");
    }

    public async Task<ProductDto?> UpdateAsync(Guid id, UpdateProductDto dto)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return null;
        }

        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == dto.CategoryId);
        if (!categoryExists)
        {
            throw new InvalidOperationException("分类不存在");
        }

        product.Name = dto.Name.Trim();
        product.ModelNumber = dto.ModelNumber.Trim();
        product.CategoryId = dto.CategoryId;
        product.Brand = dto.Brand.Trim();
        product.Price = dto.Price;
        product.Unit = dto.Unit?.Trim() ?? "件";
        product.Stock = dto.Stock;
        product.MinOrderQty = dto.MinOrderQty;
        product.Specs = dto.Specs?.Trim();
        product.Description = dto.Description?.Trim();
        product.Images = dto.Images != null && dto.Images.Any()
            ? JsonSerializer.Serialize(dto.Images)
            : null;
        product.IsActive = dto.IsActive;
        product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(id);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return false;
        }

        var hasCartItems = await _context.CartItems.AnyAsync(c => c.ProductId == id);
        if (hasCartItems)
        {
            throw new InvalidOperationException("该产品存在于购物车中，无法删除");
        }

        var hasOrderItems = await _context.OrderItems.AnyAsync(o => o.ProductId == id);
        if (hasOrderItems)
        {
            throw new InvalidOperationException("该产品存在于订单中，无法删除");
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<IEnumerable<string>> GetBrandsAsync()
    {
        return await _context.Products
            .Where(p => p.IsActive)
            .Select(p => p.Brand)
            .Distinct()
            .OrderBy(b => b)
            .ToListAsync();
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Products.AnyAsync(p => p.Id == id);
    }

    private static ProductDto MapToDto(Product product)
    {
        List<string>? images = null;
        if (!string.IsNullOrEmpty(product.Images))
        {
            try
            {
                images = JsonSerializer.Deserialize<List<string>>(product.Images);
            }
            catch
            {
                images = null;
            }
        }

        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            ModelNumber = product.ModelNumber,
            CategoryId = product.CategoryId,
            CategoryName = product.Category?.Name,
            Brand = product.Brand,
            Price = product.Price,
            Unit = product.Unit,
            Stock = product.Stock,
            MinOrderQty = product.MinOrderQty,
            Specs = product.Specs,
            Description = product.Description,
            Images = images,
            IsActive = product.IsActive,
            CreatedAt = product.CreatedAt
        };
    }
}
