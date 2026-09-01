using FurnitureShop.Api.DTOs.Common;
using FurnitureShop.Api.Entities;

namespace FurnitureShop.Api.Repositories.Interfaces;

public interface IOrderRepository : IRepository<Order>
{
    Task<Order?> GetByIdWithDetailsAsync(Guid id, CancellationToken ct = default);
    Task<(List<Order> Items, int TotalCount)> GetForUserAsync(Guid userId, PaginationParams pagination, CancellationToken ct = default);
    Task<(List<Order> Items, int TotalCount)> GetAllAsync(PaginationParams pagination, OrderStatus? status, CancellationToken ct = default);
    Task<bool> OrderNumberExistsAsync(string orderNumber, CancellationToken ct = default);
    Task<(int TotalOrders, int PendingOrders, decimal TotalRevenue)> GetStatsAsync(CancellationToken ct = default);
}
