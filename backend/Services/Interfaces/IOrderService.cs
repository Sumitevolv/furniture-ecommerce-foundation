using FurnitureShop.Api.DTOs.Common;
using FurnitureShop.Api.DTOs.Orders;

namespace FurnitureShop.Api.Services.Interfaces;

public interface IOrderService
{
    Task<OrderDto> CreateFromCartAsync(Guid userId, CreateOrderRequest request, CancellationToken ct = default);
    Task<OrderDto> GetByIdAsync(Guid userId, Guid orderId, CancellationToken ct = default);
    Task<PaginatedResponse<OrderDto>> GetForUserAsync(Guid userId, PaginationParams pagination, CancellationToken ct = default);
    Task<PaginatedResponse<OrderDto>> GetAllForAdminAsync(PaginationParams pagination, string? status, CancellationToken ct = default);
    Task<OrderDto> UpdateStatusAsync(Guid orderId, string status, CancellationToken ct = default);
}
