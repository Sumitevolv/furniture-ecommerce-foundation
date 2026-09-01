using FurnitureShop.Api.Data;
using FurnitureShop.Api.DTOs.Common;
using FurnitureShop.Api.Entities;
using FurnitureShop.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FurnitureShop.Api.Repositories;

public class OrderRepository : Repository<Order>, IOrderRepository
{
    public OrderRepository(AppDbContext context) : base(context) { }

    private IQueryable<Order> WithDetails() =>
        DbSet.Include(o => o.Items).Include(o => o.Payment).Include(o => o.User);

    public Task<Order?> GetByIdWithDetailsAsync(Guid id, CancellationToken ct = default) =>
        WithDetails().FirstOrDefaultAsync(o => o.Id == id, ct);

    public Task<bool> OrderNumberExistsAsync(string orderNumber, CancellationToken ct = default) =>
        DbSet.AnyAsync(o => o.OrderNumber == orderNumber, ct);

    public async Task<(int TotalOrders, int PendingOrders, decimal TotalRevenue)> GetStatsAsync(CancellationToken ct = default)
    {
        var totalOrders = await DbSet.CountAsync(ct);
        var pendingOrders = await DbSet.CountAsync(o => o.Status == OrderStatus.Pending, ct);
        var totalRevenue = await DbSet
            .Where(o => o.PaymentStatus == PaymentStatus.Paid)
            .SumAsync(o => (decimal?)o.Total, ct) ?? 0m;

        return (totalOrders, pendingOrders, totalRevenue);
    }

    public async Task<(List<Order> Items, int TotalCount)> GetForUserAsync(
        Guid userId, PaginationParams pagination, CancellationToken ct = default)
    {
        var query = WithDetails().Where(o => o.UserId == userId).OrderByDescending(o => o.CreatedAt);

        var totalCount = await query.CountAsync(ct);
        var items = await query
            .Skip((pagination.Page - 1) * pagination.PageSize)
            .Take(pagination.PageSize)
            .ToListAsync(ct);

        return (items, totalCount);
    }

    public async Task<(List<Order> Items, int TotalCount)> GetAllAsync(
        PaginationParams pagination, OrderStatus? status, CancellationToken ct = default)
    {
        var query = WithDetails().AsQueryable();

        if (status.HasValue)
        {
            query = query.Where(o => o.Status == status.Value);
        }

        query = query.OrderByDescending(o => o.CreatedAt);

        var totalCount = await query.CountAsync(ct);
        var items = await query
            .Skip((pagination.Page - 1) * pagination.PageSize)
            .Take(pagination.PageSize)
            .ToListAsync(ct);

        return (items, totalCount);
    }
}
