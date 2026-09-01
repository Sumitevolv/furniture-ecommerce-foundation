using FurnitureShop.Api.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace FurnitureShop.Api.Integrations.SignalR;

public interface INotificationService
{
    Task NotifyOrderStatusChangedAsync(Guid userId, Guid orderId, string status, CancellationToken ct = default);
    Task NotifyLowStockAsync(Guid productId, string productName, int remainingStock, CancellationToken ct = default);
}

/// <summary>
/// Thin wrapper around IHubContext so services never depend on SignalR
/// plumbing directly — they just call NotifyX(...). Backs the "future
/// real-time features" architecture (order tracking, admin stock alerts).
/// </summary>
public class NotificationService : INotificationService
{
    private readonly IHubContext<NotificationHub> _hubContext;

    public NotificationService(IHubContext<NotificationHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public Task NotifyOrderStatusChangedAsync(Guid userId, Guid orderId, string status, CancellationToken ct = default) =>
        _hubContext.Clients.Group(NotificationHub.GroupForUser(userId.ToString()))
            .SendAsync("OrderStatusChanged", new { orderId, status }, ct);

    public Task NotifyLowStockAsync(Guid productId, string productName, int remainingStock, CancellationToken ct = default) =>
        _hubContext.Clients.Group(NotificationHub.AdminGroup)
            .SendAsync("LowStockAlert", new { productId, productName, remainingStock }, ct);
}
