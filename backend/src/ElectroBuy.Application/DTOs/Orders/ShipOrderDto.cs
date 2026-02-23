namespace ElectroBuy.Application.DTOs.Orders;

public class ShipOrderDto
{
    public string? TrackingNumber { get; set; }
}

public class BatchConfirmDto
{
    public List<Guid> OrderIds { get; set; } = new();
}
