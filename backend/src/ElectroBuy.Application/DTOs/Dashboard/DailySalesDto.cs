namespace ElectroBuy.Application.DTOs.Dashboard;

public class DailySalesDto
{
    public DateTime Date { get; set; }
    public decimal Amount { get; set; }
    public int OrderCount { get; set; }
}
