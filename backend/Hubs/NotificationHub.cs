using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace FurnitureShop.Api.Hubs;

/// <summary>
/// Foundation hub for future real-time features: live order status updates,
/// low-stock alerts for admins, AI chat streaming, etc. Clients connect to
/// /hubs/notifications (see Program.cs) and are added to a per-user group
/// on connect so the server can target notifications at one user.
/// </summary>
[Authorize]
public class NotificationHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        var userId = Context.UserIdentifier;
        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, GroupForUser(userId));
        }
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.UserIdentifier;
        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, GroupForUser(userId));
        }
        await base.OnDisconnectedAsync(exception);
    }

    public static string GroupForUser(string userId) => $"user:{userId}";
    public const string AdminGroup = "admins";
}
