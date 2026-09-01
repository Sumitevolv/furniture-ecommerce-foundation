using FurnitureShop.Api.DTOs.Admin;
using FurnitureShop.Api.DTOs.Common;
using FurnitureShop.Api.Repositories.Interfaces;
using FurnitureShop.Api.Services.Interfaces;

namespace FurnitureShop.Api.Services;

public class AdminService : IAdminService
{
    private readonly IProductRepository _productRepository;
    private readonly IOrderRepository _orderRepository;
    private readonly IUserRepository _userRepository;

    public AdminService(IProductRepository productRepository, IOrderRepository orderRepository, IUserRepository userRepository)
    {
        _productRepository = productRepository;
        _orderRepository = orderRepository;
        _userRepository = userRepository;
    }

    public async Task<AdminDashboardStatsDto> GetDashboardStatsAsync(CancellationToken ct = default)
    {
        var totalProducts = await _productRepository.CountActiveAsync(ct);
        var lowStockProducts = await _productRepository.CountLowStockAsync(ct);
        var (totalOrders, pendingOrders, totalRevenue) = await _orderRepository.GetStatsAsync(ct);
        var totalCustomers = await _userRepository.CountCustomersAsync(ct);

        return new AdminDashboardStatsDto
        {
            TotalProducts = totalProducts,
            LowStockProducts = lowStockProducts,
            TotalOrders = totalOrders,
            PendingOrders = pendingOrders,
            TotalRevenue = totalRevenue,
            TotalCustomers = totalCustomers,
        };
    }

    public async Task<PaginatedResponse<AdminCustomerDto>> GetCustomersAsync(
        PaginationParams pagination, string? search, CancellationToken ct = default)
    {
        var (items, totalCount) = await _userRepository.GetCustomersAsync(pagination.Page, pagination.PageSize, search, ct);

        return new PaginatedResponse<AdminCustomerDto>
        {
            Items = items.Select(u => new AdminCustomerDto
            {
                Id = u.Id,
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName,
                EmailVerified = u.EmailVerified,
                IsActive = u.IsActive,
                CreatedAt = u.CreatedAt,
            }).ToList(),
            Page = pagination.Page,
            PageSize = pagination.PageSize,
            TotalItems = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pagination.PageSize),
        };
    }
}
