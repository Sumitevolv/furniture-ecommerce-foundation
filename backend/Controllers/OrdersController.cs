using FurnitureShop.Api.Authentication;
using FurnitureShop.Api.DTOs.Common;
using FurnitureShop.Api.DTOs.Orders;
using FurnitureShop.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FurnitureShop.Api.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly ICurrentUserService _currentUser;

    public OrdersController(IOrderService orderService, ICurrentUserService currentUser)
    {
        _orderService = orderService;
        _currentUser = currentUser;
    }

    private Guid UserId => _currentUser.UserId!.Value;

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderRequest request, CancellationToken ct)
    {
        var order = await _orderService.CreateFromCartAsync(UserId, request, ct);
        return CreatedAtAction(nameof(GetById), new { orderId = order.Id }, ApiResponse<OrderDto>.Ok(order, "Order created."));
    }

    [HttpGet]
    public async Task<IActionResult> GetForUser([FromQuery] PaginationParams pagination, CancellationToken ct)
    {
        var orders = await _orderService.GetForUserAsync(UserId, pagination, ct);
        return Ok(ApiResponse<PaginatedResponse<OrderDto>>.Ok(orders));
    }

    [HttpGet("admin/all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllForAdmin([FromQuery] PaginationParams pagination, [FromQuery] string? status, CancellationToken ct)
    {
        var orders = await _orderService.GetAllForAdminAsync(pagination, status, ct);
        return Ok(ApiResponse<PaginatedResponse<OrderDto>>.Ok(orders));
    }

    [HttpGet("{orderId:guid}")]
    public async Task<IActionResult> GetById(Guid orderId, CancellationToken ct)
    {
        var order = await _orderService.GetByIdAsync(UserId, orderId, ct);
        return Ok(ApiResponse<OrderDto>.Ok(order));
    }

    [HttpPatch("{orderId:guid}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus(Guid orderId, [FromBody] UpdateOrderStatusRequest request, CancellationToken ct)
    {
        var order = await _orderService.UpdateStatusAsync(orderId, request.Status, ct);
        return Ok(ApiResponse<OrderDto>.Ok(order, "Order status updated."));
    }
}

public record UpdateOrderStatusRequest(string Status);
