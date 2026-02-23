using ElectroBuy.Application.DTOs.Orders;

namespace ElectroBuy.Application.Interfaces;

public interface IOrderService
{
    Task<OrderListDto> GetOrdersAsync(Guid userId, OrderQueryDto query);
    Task<OrderDto?> GetOrderByIdAsync(Guid userId, Guid orderId);
    Task<OrderDto> CreateOrderAsync(Guid userId, CreateOrderDto dto);
    Task<OrderDto?> CancelOrderAsync(Guid userId, Guid orderId);
    Task<int> GetOrderCountAsync(Guid userId);

    Task<OrderDto?> ConfirmOrderAsync(Guid orderId);
    Task<OrderDto?> ShipOrderAsync(Guid orderId, string? trackingNumber);
    Task<OrderDto?> CompleteOrderAsync(Guid userId, Guid orderId);

    Task<OrderListDto> GetAllOrdersAsync(OrderQueryDto query);
    Task<OrderDto?> GetOrderByIdForAdminAsync(Guid orderId);
    Task<byte[]> ExportOrdersAsync(OrderQueryDto query);
    Task<int> BatchConfirmOrdersAsync(List<Guid> orderIds);
}
