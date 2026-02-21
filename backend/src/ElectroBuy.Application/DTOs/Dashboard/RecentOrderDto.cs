namespace ElectroBuy.Application.DTOs.Dashboard;

public class RecentOrderDto
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public int Status { get; set; }
    public DateTime CreatedAt { get; set; }
}
