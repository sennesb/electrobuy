using ElectroBuy.Application.DTOs.Categories;
using ElectroBuy.Application.Interfaces;
using ElectroBuy.Domain.Entities;
using ElectroBuy.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ElectroBuy.Infrastructure.Services;

public class CategoryService : ICategoryService
{
    private readonly ElectroBuyDbContext _context;

    public CategoryService(ElectroBuyDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CategoryDto>> GetAllAsync()
    {
        var categories = await _context.Categories
            .Include(c => c.Parent)
            .OrderBy(c => c.SortOrder)
            .ThenBy(c => c.Name)
            .ToListAsync();

        return categories.Select(MapToDto);
    }

    public async Task<IEnumerable<CategoryTreeDto>> GetTreeAsync()
    {
        var categories = await _context.Categories
            .OrderBy(c => c.SortOrder)
            .ThenBy(c => c.Name)
            .ToListAsync();

        var rootCategories = categories.Where(c => c.ParentId == null).ToList();
        return rootCategories.Select(c => BuildTree(c, categories));
    }

    public async Task<CategoryDto?> GetByIdAsync(int id)
    {
        var category = await _context.Categories
            .Include(c => c.Parent)
            .FirstOrDefaultAsync(c => c.Id == id);

        return category != null ? MapToDto(category) : null;
    }

    public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto)
    {
        if (dto.ParentId.HasValue)
        {
            var parentExists = await _context.Categories.AnyAsync(c => c.Id == dto.ParentId.Value);
            if (!parentExists)
            {
                throw new InvalidOperationException("父分类不存在");
            }
        }

        var category = new Category
        {
            Name = dto.Name.Trim(),
            ParentId = dto.ParentId,
            Description = dto.Description?.Trim(),
            SortOrder = dto.SortOrder,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(category.Id) ?? throw new InvalidOperationException("创建分类失败");
    }

    public async Task<CategoryDto?> UpdateAsync(int id, UpdateCategoryDto dto)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null)
        {
            return null;
        }

        if (dto.ParentId.HasValue)
        {
            if (dto.ParentId.Value == id)
            {
                throw new InvalidOperationException("分类不能将自己设为父分类");
            }

            var parentExists = await _context.Categories.AnyAsync(c => c.Id == dto.ParentId.Value);
            if (!parentExists)
            {
                throw new InvalidOperationException("父分类不存在");
            }

            if (await IsDescendantAsync(id, dto.ParentId.Value))
            {
                throw new InvalidOperationException("不能将子分类设为父分类");
            }
        }

        category.Name = dto.Name.Trim();
        category.ParentId = dto.ParentId;
        category.Description = dto.Description?.Trim();
        category.SortOrder = dto.SortOrder;
        category.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(id);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null)
        {
            return false;
        }

        if (await HasChildrenAsync(id))
        {
            throw new InvalidOperationException("该分类下存在子分类，无法删除");
        }

        var hasProducts = await _context.Products.AnyAsync(p => p.CategoryId == id);
        if (hasProducts)
        {
            throw new InvalidOperationException("该分类下存在产品，无法删除");
        }

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> HasChildrenAsync(int id)
    {
        return await _context.Categories.AnyAsync(c => c.ParentId == id);
    }

    private async Task<bool> IsDescendantAsync(int ancestorId, int descendantId)
    {
        var visited = new HashSet<int>();
        int? currentId = descendantId;

        while (currentId.HasValue && !visited.Contains(currentId.Value))
        {
            visited.Add(currentId.Value);

            var parent = await _context.Categories
                .Where(c => c.Id == currentId.Value)
                .Select(c => c.ParentId)
                .FirstOrDefaultAsync();

            if (parent == ancestorId)
            {
                return true;
            }

            currentId = parent;
        }

        return false;
    }

    private static CategoryDto MapToDto(Category category)
    {
        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            ParentId = category.ParentId,
            ParentName = category.Parent?.Name,
            Description = category.Description,
            SortOrder = category.SortOrder,
            IsActive = category.IsActive,
            CreatedAt = category.CreatedAt
        };
    }

    private CategoryTreeDto BuildTree(Category category, List<Category> allCategories)
    {
        var children = allCategories.Where(c => c.ParentId == category.Id).ToList();

        return new CategoryTreeDto
        {
            Id = category.Id,
            Name = category.Name,
            ParentId = category.ParentId,
            Description = category.Description,
            SortOrder = category.SortOrder,
            IsActive = category.IsActive,
            Children = children.Select(c => BuildTree(c, allCategories)).ToList()
        };
    }
}
