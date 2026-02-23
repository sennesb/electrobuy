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

        var pageSize = Math.Min(Math.Max(query.PageSize, 1), 100);

        var orders = await queryable
            .OrderByDescending(o => o.CreatedAt)
            .Skip((query.Page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new OrderListDto
        {
            Data = orders.Select(MapToDto).ToList(),
            Total = total,
            Page = query.Page,
            PageSize = pageSize
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

    public async Task<OrderDto?> ConfirmOrderAsync(Guid orderId)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null)
        {
            return null;
        }

        if (order.Status != OrderStatus.Pending)
        {
            throw new InvalidOperationException("只有待确认状态的订单可以确认");
        }

        order.Status = OrderStatus.Confirmed;
        order.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDto(order);
    }

    public async Task<OrderDto?> ShipOrderAsync(Guid orderId, string? trackingNumber)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null)
        {
            return null;
        }

        if (order.Status != OrderStatus.Confirmed)
        {
            throw new InvalidOperationException("只有已确认状态的订单可以发货");
        }

        order.Status = OrderStatus.Shipped;
        order.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDto(order);
    }

    public async Task<OrderDto?> CompleteOrderAsync(Guid userId, Guid orderId)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

        if (order == null)
        {
            return null;
        }

        if (order.Status != OrderStatus.Shipped)
        {
            throw new InvalidOperationException("只有已发货状态的订单可以确认收货");
        }

        order.Status = OrderStatus.Completed;
        order.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDto(order);
    }

    public async Task<OrderListDto> GetAllOrdersAsync(OrderQueryDto query)
    {
        var queryable = _context.Orders
            .Include(o => o.OrderItems)
            .Include(o => o.User)
            .AsQueryable();

        if (query.Status.HasValue)
        {
            queryable = queryable.Where(o => (int)o.Status == query.Status.Value);
        }

        if (!string.IsNullOrEmpty(query.Keyword))
        {
            var keyword = query.Keyword.ToLower().Trim();
            queryable = queryable.Where(o =>
                o.OrderNumber.ToLower().Contains(keyword) ||
                (o.User != null && o.User.Email.ToLower().Contains(keyword)) ||
                (o.User != null && o.User.Name != null && o.User.Name.ToLower().Contains(keyword))
            );
        }

        if (query.StartDate.HasValue)
        {
            queryable = queryable.Where(o => o.CreatedAt >= query.StartDate.Value);
        }

        if (query.EndDate.HasValue)
        {
            var endDate = query.EndDate.Value.AddDays(1);
            queryable = queryable.Where(o => o.CreatedAt < endDate);
        }

        var total = await queryable.CountAsync();

        var pageSize = Math.Min(Math.Max(query.PageSize, 1), 100);
        var totalPages = (int)Math.Ceiling(total / (double)pageSize);

        var orders = await queryable
            .OrderByDescending(o => o.CreatedAt)
            .Skip((query.Page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new OrderListDto
        {
            Data = orders.Select(MapToDtoWithUser).ToList(),
            Total = total,
            Page = query.Page,
            PageSize = pageSize
        };
    }

    public async Task<OrderDto?> GetOrderByIdForAdminAsync(Guid orderId)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .Include(o => o.User)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null)
        {
            return null;
        }

        return MapToDtoWithUser(order);
    }

    public async Task<byte[]> ExportOrdersAsync(OrderQueryDto query)
    {
        var queryable = _context.Orders
            .Include(o => o.OrderItems)
            .Include(o => o.User)
            .AsQueryable();

        if (query.Status.HasValue)
        {
            queryable = queryable.Where(o => (int)o.Status == query.Status.Value);
        }

        if (!string.IsNullOrEmpty(query.Keyword))
        {
            var keyword = query.Keyword.ToLower().Trim();
            queryable = queryable.Where(o =>
                o.OrderNumber.ToLower().Contains(keyword) ||
                (o.User != null && o.User.Email.ToLower().Contains(keyword))
            );
        }

        if (query.StartDate.HasValue)
        {
            queryable = queryable.Where(o => o.CreatedAt >= query.StartDate.Value);
        }

        if (query.EndDate.HasValue)
        {
            var endDate = query.EndDate.Value.AddDays(1);
            queryable = queryable.Where(o => o.CreatedAt < endDate);
        }

        var orders = await queryable
            .OrderByDescending(o => o.CreatedAt)
            .Take(1000)
            .ToListAsync();

        var csv = new System.Text.StringBuilder();
        csv.AppendLine("订单号,用户邮箱,用户姓名,商品数量,总金额,状态,下单时间");

        foreach (var order in orders)
        {
            csv.AppendLine($"\"{order.OrderNumber}\",\"{order.User?.Email ?? ""}\",\"{order.User?.Name ?? ""}\",{order.OrderItems.Count},{order.TotalAmount},\"{GetStatusText(order.Status)}\",\"{order.CreatedAt:yyyy-MM-dd HH:mm:ss}\"");
        }

        return System.Text.Encoding.UTF8.GetBytes(csv.ToString());
    }

    public async Task<int> BatchConfirmOrdersAsync(List<Guid> orderIds)
    {
        var orders = await _context.Orders
            .Where(o => orderIds.Contains(o.Id) && o.Status == OrderStatus.Pending)
            .ToListAsync();

        foreach (var order in orders)
        {
            order.Status = OrderStatus.Confirmed;
            order.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        return orders.Count;
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

    private static OrderDto MapToDtoWithUser(Order order)
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
            }).ToList() ?? new List<OrderItemDto>(),
            UserId = order.UserId,
            UserName = order.User?.Name,
            UserEmail = order.User?.Email
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
