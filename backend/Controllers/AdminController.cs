using FurnitureShop.Api.DTOs.Admin;
using FurnitureShop.Api.DTOs.Common;
using FurnitureShop.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FurnitureShop.Api.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats(CancellationToken ct)
    {
        var stats = await _adminService.GetDashboardStatsAsync(ct);
        return Ok(ApiResponse<AdminDashboardStatsDto>.Ok(stats));
    }

    [HttpGet("customers")]
    public async Task<IActionResult> GetCustomers([FromQuery] PaginationParams pagination, [FromQuery] string? search, CancellationToken ct)
    {
        var customers = await _adminService.GetCustomersAsync(pagination, search, ct);
        return Ok(ApiResponse<PaginatedResponse<AdminCustomerDto>>.Ok(customers));
    }
}
