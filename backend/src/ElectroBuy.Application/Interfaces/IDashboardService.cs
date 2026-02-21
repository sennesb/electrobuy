using ElectroBuy.Application.DTOs.Dashboard;

namespace ElectroBuy.Application.Interfaces;

public interface IDashboardService
{
    Task<DashboardStatsDto> GetDashboardStatsAsync();
}
