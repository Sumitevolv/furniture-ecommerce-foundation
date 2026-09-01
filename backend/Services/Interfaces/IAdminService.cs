using FurnitureShop.Api.DTOs.Admin;
using FurnitureShop.Api.DTOs.Common;

namespace FurnitureShop.Api.Services.Interfaces;

public interface IAdminService
{
    Task<AdminDashboardStatsDto> GetDashboardStatsAsync(CancellationToken ct = default);
    Task<PaginatedResponse<AdminCustomerDto>> GetCustomersAsync(PaginationParams pagination, string? search, CancellationToken ct = default);
}
