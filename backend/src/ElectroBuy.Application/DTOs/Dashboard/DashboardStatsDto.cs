namespace ElectroBuy.Application.DTOs.Dashboard;

public class DashboardStatsDto
{
    public int TotalOrders { get; set; }
    public decimal TotalSales { get; set; }
    public int TotalProducts { get; set; }
    public int TotalUsers { get; set; }
    public int PendingOrders { get; set; }
    public int LowStockProducts { get; set; }
    public List<RecentOrderDto> RecentOrders { get; set; } = [];
    public List<DailySalesDto> SalesTrend { get; set; } = [];
}
