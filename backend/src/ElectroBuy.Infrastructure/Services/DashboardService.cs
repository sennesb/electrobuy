using ElectroBuy.Application.DTOs.Dashboard;
using ElectroBuy.Application.Interfaces;
using ElectroBuy.Domain.Enums;
using ElectroBuy.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ElectroBuy.Infrastructure.Services;

public class DashboardService : IDashboardService
{
    private readonly ElectroBuyDbContext _context;

    public DashboardService(ElectroBuyDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardStatsDto> GetDashboardStatsAsync()
    {
        var totalOrders = await _context.Orders.CountAsync();
        var totalSales = await _context.Orders
            .Where(o => o.Status != OrderStatus.Cancelled)
            .SumAsync(o => o.TotalAmount);
        var totalProducts = await _context.Products.CountAsync();
        var totalUsers = await _context.Users.CountAsync();
        var pendingOrders = await _context.Orders
            .CountAsync(o => o.Status == OrderStatus.Pending);
        var lowStockProducts = await _context.Products
            .CountAsync(p => p.Stock < 10 && p.IsActive);

        var recentOrders = await _context.Orders
            .Include(o => o.User)
            .OrderByDescending(o => o.CreatedAt)
            .Take(5)
            .Select(o => new RecentOrderDto
            {
                Id = o.Id,
                OrderNumber = o.OrderNumber,
                CustomerName = o.User != null ? o.User.Name ?? "未知用户" : "未知用户",
                TotalAmount = o.TotalAmount,
                Status = (int)o.Status,
                CreatedAt = o.CreatedAt
            })
            .ToListAsync();

        var today = DateTime.UtcNow.Date;
        var salesTrend = new List<DailySalesDto>();

        for (var i = 6; i >= 0; i--)
        {
            var date = today.AddDays(-i);
            var dayStart = date;
            var dayEnd = date.AddDays(1);

            var ordersOnDay = await _context.Orders
                .Where(o => o.CreatedAt >= dayStart && o.CreatedAt < dayEnd && o.Status != OrderStatus.Cancelled)
                .ToListAsync();

            salesTrend.Add(new DailySalesDto
            {
                Date = date,
                Amount = ordersOnDay.Sum(o => o.TotalAmount),
                OrderCount = ordersOnDay.Count
            });
        }

        return new DashboardStatsDto
        {
            TotalOrders = totalOrders,
            TotalSales = totalSales,
            TotalProducts = totalProducts,
            TotalUsers = totalUsers,
            PendingOrders = pendingOrders,
            LowStockProducts = lowStockProducts,
            RecentOrders = recentOrders,
            SalesTrend = salesTrend
        };
    }
}
