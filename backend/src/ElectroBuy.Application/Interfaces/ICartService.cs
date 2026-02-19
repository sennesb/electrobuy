using ElectroBuy.Application.DTOs.Cart;

namespace ElectroBuy.Application.Interfaces;

public interface ICartService
{
    Task<CartDto> GetCartAsync(Guid userId);
    Task<CartItemDto> AddToCartAsync(Guid userId, AddToCartDto dto);
    Task<CartItemDto?> UpdateQuantityAsync(Guid userId, Guid cartItemId, UpdateCartDto dto);
    Task<bool> RemoveItemAsync(Guid userId, Guid cartItemId);
    Task<bool> ClearCartAsync(Guid userId);
    Task<int> GetCartItemCountAsync(Guid userId);
}
