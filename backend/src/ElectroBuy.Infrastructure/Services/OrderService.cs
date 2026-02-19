using ElectroBuy.Application.DTOs.Orders;
using ElectroBuy.Application.Interfaces;
using ElectroBuy.Domain.Entities;
using ElectroBuy.Domain.Enums;
using ElectroBuy.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ElectroBuy.Infrastructure.Services;

public class OrderService : IOrderService
{
    private readonly ElectroBuyDbContext _context;

    public OrderService(ElectroBuyDbContext context)
    {
        _context = context;
    }

    public async Task<OrderListDto> GetOrdersAsync(Guid userId, OrderQueryDto query)
    {
        var queryable = _context.Orders
            .Include(o => o.OrderItems)
            .Where(o => o.UserId == userId);

        if (query.Status.HasValue)
        {
            queryable = queryable.Where(o => (int)o.Status == query.Status.Value);
        }

        var total = await queryable.CountAsync();

        var orders = await queryable
            .OrderByDescending(o => o.CreatedAt)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync();

        return new OrderListDto
        {
            Data = orders.Select(MapToDto).ToList(),
            Total = total,
            Page = query.Page,
            PageSize = query.PageSize
        };
    }

    public async Task<OrderDto?> GetOrderByIdAsync(Guid userId, Guid orderId)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

        if (order == null)
        {
            return null;
        }

        return MapToDto(order);
    }

    public async Task<OrderDto> CreateOrderAsync(Guid userId, CreateOrderDto dto)
    {
        var cartItems = await _context.CartItems
            .Include(c => c.Product)
            .Where(c => c.UserId == userId)
            .ToListAsync();

        if (!cartItems.Any())
        {
            throw new InvalidOperationException("购物车为空，无法创建订单");
        }

        foreach (var item in cartItems)
        {
            if (item.Product == null)
            {
                throw new InvalidOperationException($"产品不存在: {item.ProductId}");
            }

            if (!item.Product.IsActive)
            {
                throw new InvalidOperationException($"产品已下架: {item.Product.Name}");
            }

            if (item.Product.Stock < item.Quantity)
            {
                throw new InvalidOperationException($"库存不足: {item.Product.Name}，当前库存: {item.Product.Stock}，需要: {item.Quantity}");
            }
        }

        var orderNumber = GenerateOrderNumber();

        var order = new Order
        {
            Id = Guid.NewGuid(),
            OrderNumber = orderNumber,
            UserId = userId,
            Status = OrderStatus.Pending,
            TotalAmount = cartItems.Sum(c => c.Product!.Price * c.Quantity),
            Remark = dto.Remark,
            CreatedAt = DateTime.UtcNow
        };

        _context.Orders.Add(order);

        foreach (var cartItem in cartItems)
        {
            var orderItem = new OrderItem
            {
                Id = Guid.NewGuid(),
                OrderId = order.Id,
                ProductId = cartItem.ProductId,
                ProductName = cartItem.Product!.Name,
                ModelNumber = cartItem.Product.ModelNumber,
                Quantity = cartItem.Quantity,
                UnitPrice = cartItem.Product.Price,
                CreatedAt = DateTime.UtcNow
            };

            _context.OrderItems.Add(orderItem);

            cartItem.Product.Stock -= cartItem.Quantity;
        }

        _context.CartItems.RemoveRange(cartItems);

        await _context.SaveChangesAsync();

        var createdOrder = await _context.Orders
            .Include(o => o.OrderItems)
            .FirstAsync(o => o.Id == order.Id);

        return MapToDto(createdOrder);
    }

    public async Task<OrderDto?> CancelOrderAsync(Guid userId, Guid orderId)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

        if (order == null)
        {
            return null;
        }

        if (order.Status != OrderStatus.Pending)
        {
            throw new InvalidOperationException("只有待确认状态的订单可以取消");
        }

        foreach (var orderItem in order.OrderItems)
        {
            if (orderItem.Product != null)
            {
                orderItem.Product.Stock += orderItem.Quantity;
            }
        }

        order.Status = OrderStatus.Cancelled;
        order.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDto(order);
    }

    public async Task<int> GetOrderCountAsync(Guid userId)
    {
        return await _context.Orders
            .Where(o => o.UserId == userId)
            .CountAsync();
    }

    private static string GenerateOrderNumber()
    {
        var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
        var random = new Random().Next(1000, 9999);
        return $"EB{timestamp}{random}";
    }

    private static OrderDto MapToDto(Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            Status = (int)order.Status,
            StatusText = GetStatusText(order.Status),
            TotalAmount = order.TotalAmount,
            Remark = order.Remark,
            CreatedAt = order.CreatedAt,
            UpdatedAt = order.UpdatedAt,
            Items = order.OrderItems?.Select(oi => new OrderItemDto
            {
                Id = oi.Id,
                ProductId = oi.ProductId,
                ProductName = oi.ProductName,
                ModelNumber = oi.ModelNumber,
                Quantity = oi.Quantity,
                UnitPrice = oi.UnitPrice
            }).ToList() ?? new List<OrderItemDto>()
        };
    }

    private static string GetStatusText(OrderStatus status)
    {
        return status switch
        {
            OrderStatus.Pending => "待确认",
            OrderStatus.Confirmed => "已确认",
            OrderStatus.Shipped => "已发货",
            OrderStatus.Completed => "已完成",
            OrderStatus.Cancelled => "已取消",
            _ => "未知"
        };
    }
}
