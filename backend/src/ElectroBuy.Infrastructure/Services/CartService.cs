using System.Text.Json;
using ElectroBuy.Application.DTOs.Cart;
using ElectroBuy.Application.Interfaces;
using ElectroBuy.Domain.Entities;
using ElectroBuy.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ElectroBuy.Infrastructure.Services;

public class CartService : ICartService
{
    private readonly ElectroBuyDbContext _context;

    public CartService(ElectroBuyDbContext context)
    {
        _context = context;
    }

    public async Task<CartDto> GetCartAsync(Guid userId)
    {
        var items = await _context.CartItems
            .Include(c => c.Product)
            .Where(c => c.UserId == userId)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        return new CartDto
        {
            Items = items.Select(MapToDto).ToList()
        };
    }

    public async Task<CartItemDto> AddToCartAsync(Guid userId, AddToCartDto dto)
    {
        var product = await _context.Products.FindAsync(dto.ProductId);
        if (product == null)
        {
            throw new InvalidOperationException("产品不存在");
        }

        if (!product.IsActive)
        {
            throw new InvalidOperationException("该产品已下架");
        }

        if (product.Stock < dto.Quantity)
        {
            throw new InvalidOperationException("库存不足");
        }

        var existingItem = await _context.CartItems
            .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == dto.ProductId);

        if (existingItem != null)
        {
            var newQuantity = existingItem.Quantity + dto.Quantity;
            if (product.Stock < newQuantity)
            {
                throw new InvalidOperationException("库存不足");
            }

            existingItem.Quantity = newQuantity;
            existingItem.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return MapToDto(existingItem, product);
        }

        var cartItem = new CartItem
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            ProductId = dto.ProductId,
            Quantity = dto.Quantity,
            CreatedAt = DateTime.UtcNow
        };

        _context.CartItems.Add(cartItem);
        await _context.SaveChangesAsync();

        return MapToDto(cartItem, product);
    }

    public async Task<CartItemDto?> UpdateQuantityAsync(Guid userId, Guid cartItemId, UpdateCartDto dto)
    {
        var cartItem = await _context.CartItems
            .Include(c => c.Product)
            .FirstOrDefaultAsync(c => c.Id == cartItemId && c.UserId == userId);

        if (cartItem == null)
        {
            return null;
        }

        if (dto.Quantity == 0)
        {
            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
            return null;
        }

        if (cartItem.Product == null)
        {
            throw new InvalidOperationException("产品不存在");
        }

        if (cartItem.Product.Stock < dto.Quantity)
        {
            throw new InvalidOperationException("库存不足");
        }

        cartItem.Quantity = dto.Quantity;
        cartItem.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return MapToDto(cartItem, cartItem.Product);
    }

    public async Task<bool> RemoveItemAsync(Guid userId, Guid cartItemId)
    {
        var cartItem = await _context.CartItems
            .FirstOrDefaultAsync(c => c.Id == cartItemId && c.UserId == userId);

        if (cartItem == null)
        {
            return false;
        }

        _context.CartItems.Remove(cartItem);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> ClearCartAsync(Guid userId)
    {
        var items = await _context.CartItems
            .Where(c => c.UserId == userId)
            .ToListAsync();

        if (!items.Any())
        {
            return true;
        }

        _context.CartItems.RemoveRange(items);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<int> GetCartItemCountAsync(Guid userId)
    {
        return await _context.CartItems
            .Where(c => c.UserId == userId)
            .SumAsync(c => c.Quantity);
    }

    private static CartItemDto MapToDto(CartItem cartItem, Product? product = null)
    {
        var p = product ?? cartItem.Product;
        if (p == null)
        {
            return new CartItemDto();
        }

        string? image = null;
        if (!string.IsNullOrEmpty(p.Images))
        {
            try
            {
                var images = JsonSerializer.Deserialize<List<string>>(p.Images);
                image = images?.FirstOrDefault();
            }
            catch
            {
                image = null;
            }
        }

        return new CartItemDto
        {
            Id = cartItem.Id,
            ProductId = p.Id,
            ProductName = p.Name,
            ModelNumber = p.ModelNumber,
            Brand = p.Brand,
            Price = p.Price,
            Unit = p.Unit,
            Quantity = cartItem.Quantity,
            Stock = p.Stock,
            Image = image,
            IsActive = p.IsActive
        };
    }
}
