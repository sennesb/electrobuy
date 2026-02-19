using ElectroBuy.Application.DTOs.Orders;

namespace ElectroBuy.Application.Interfaces;

public interface IOrderService
{
    Task<OrderListDto> GetOrdersAsync(Guid userId, OrderQueryDto query);
    Task<OrderDto?> GetOrderByIdAsync(Guid userId, Guid orderId);
    Task<OrderDto> CreateOrderAsync(Guid userId, CreateOrderDto dto);
    Task<OrderDto?> CancelOrderAsync(Guid userId, Guid orderId);
    Task<int> GetOrderCountAsync(Guid userId);
}
