using FurnitureShop.Api.DTOs.Common;
using FurnitureShop.Api.DTOs.Orders;
using FurnitureShop.Api.Entities;
using FurnitureShop.Api.Helpers;
using FurnitureShop.Api.Integrations.SignalR;
using FurnitureShop.Api.Middleware;
using FurnitureShop.Api.Repositories.Interfaces;
using FurnitureShop.Api.Services.Interfaces;

namespace FurnitureShop.Api.Services;

public class OrderService : IOrderService
{
    private const decimal TaxRate = 0.05m;

    private readonly IOrderRepository _orderRepository;
    private readonly ICartRepository _cartRepository;
    private readonly INotificationService _notificationService;

    public OrderService(
        IOrderRepository orderRepository,
        ICartRepository cartRepository,
        INotificationService notificationService)
    {
        _orderRepository = orderRepository;
        _cartRepository = cartRepository;
        _notificationService = notificationService;
    }

    public async Task<OrderDto> CreateFromCartAsync(Guid userId, CreateOrderRequest request, CancellationToken ct = default)
    {
        var cart = await _cartRepository.GetByUserIdAsync(userId, ct);

        if (cart == null || cart.Items.Count == 0)
        {
            throw new AppException("Your cart is empty.");
        }

        var subtotal = cart.Items.Sum(i => i.UnitPrice * i.Quantity);
        var tax = Math.Round(subtotal * TaxRate, 2);
        const decimal shipping = 0m;

        string orderNumber;
        do
        {
            orderNumber = OrderNumberHelper.Generate();
        } while (await _orderRepository.OrderNumberExistsAsync(orderNumber, ct));

        var order = new Order
        {
            OrderNumber = orderNumber,
            UserId = userId,
            Status = OrderStatus.Pending,
            PaymentStatus = PaymentStatus.Pending,
            ShippingFullName = request.ShippingAddress.FullName,
            ShippingPhone = request.ShippingAddress.Phone,
            ShippingLine1 = request.ShippingAddress.Line1,
            ShippingLine2 = request.ShippingAddress.Line2,
            ShippingCity = request.ShippingAddress.City,
            ShippingState = request.ShippingAddress.State,
            ShippingPostalCode = request.ShippingAddress.PostalCode,
            ShippingCountry = request.ShippingAddress.Country,
            Subtotal = subtotal,
            Tax = tax,
            Shipping = shipping,
            Total = subtotal + tax + shipping,
            Notes = request.Notes,
            Items = cart.Items.Select(i => new OrderItem
            {
                ProductId = i.ProductId,
                ProductName = i.Product.Name,
                ProductImageUrl = i.Product.Images.FirstOrDefault(img => img.IsPrimary)?.Url
                                  ?? i.Product.Images.FirstOrDefault()?.Url,
                VariantLabel = i.Variant?.Name,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                LineTotal = i.UnitPrice * i.Quantity,
            }).ToList(),
        };

        await _orderRepository.AddAsync(order, ct);

        // Clear the cart now that its contents are captured in the order.
        cart.Items.Clear();

        await _orderRepository.SaveChangesAsync(ct);

        return ToDto(order);
    }

    public async Task<OrderDto> GetByIdAsync(Guid userId, Guid orderId, CancellationToken ct = default)
    {
        var order = await _orderRepository.GetByIdWithDetailsAsync(orderId, ct)
            ?? throw new NotFoundException("Order not found.");

        if (order.UserId != userId)
        {
            throw new UnauthorizedAccessException();
        }

        return ToDto(order);
    }

    public async Task<PaginatedResponse<OrderDto>> GetForUserAsync(Guid userId, PaginationParams pagination, CancellationToken ct = default)
    {
        var (items, totalCount) = await _orderRepository.GetForUserAsync(userId, pagination, ct);

        return new PaginatedResponse<OrderDto>
        {
            Items = items.Select(o => ToDto(o)).ToList(),
            Page = pagination.Page,
            PageSize = pagination.PageSize,
            TotalItems = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pagination.PageSize),
        };
    }

    public async Task<PaginatedResponse<OrderDto>> GetAllForAdminAsync(PaginationParams pagination, string? status, CancellationToken ct = default)
    {
        OrderStatus? parsedStatus = null;
        if (!string.IsNullOrWhiteSpace(status))
        {
            if (!Enum.TryParse<OrderStatus>(status, ignoreCase: true, out var s))
            {
                throw new AppException($"Unknown order status '{status}'.");
            }
            parsedStatus = s;
        }

        var (items, totalCount) = await _orderRepository.GetAllAsync(pagination, parsedStatus, ct);

        return new PaginatedResponse<OrderDto>
        {
            Items = items.Select(o => ToDto(o, includeCustomer: true)).ToList(),
            Page = pagination.Page,
            PageSize = pagination.PageSize,
            TotalItems = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pagination.PageSize),
        };
    }

    public async Task<OrderDto> UpdateStatusAsync(Guid orderId, string status, CancellationToken ct = default)
    {
        var order = await _orderRepository.GetByIdWithDetailsAsync(orderId, ct)
            ?? throw new NotFoundException("Order not found.");

        if (!Enum.TryParse<OrderStatus>(status, ignoreCase: true, out var parsedStatus))
        {
            throw new AppException($"Unknown order status '{status}'.");
        }

        order.Status = parsedStatus;
        await _orderRepository.SaveChangesAsync(ct);

        await _notificationService.NotifyOrderStatusChangedAsync(order.UserId, order.Id, parsedStatus.ToString(), ct);

        return ToDto(order);
    }

    private static OrderDto ToDto(Order order, bool includeCustomer = false) => new()
    {
        Id = order.Id,
        OrderNumber = order.OrderNumber,
        Items = order.Items.Select(i => new OrderItemDto
        {
            Id = i.Id,
            ProductName = i.ProductName,
            ProductImageUrl = i.ProductImageUrl,
            VariantLabel = i.VariantLabel,
            Quantity = i.Quantity,
            UnitPrice = i.UnitPrice,
            LineTotal = i.LineTotal,
        }).ToList(),
        Status = order.Status.ToString().ToLowerInvariant(),
        PaymentStatus = order.PaymentStatus.ToString().ToLowerInvariant(),
        ShippingAddress = new AddressDto
        {
            FullName = order.ShippingFullName,
            Phone = order.ShippingPhone,
            Line1 = order.ShippingLine1,
            Line2 = order.ShippingLine2,
            City = order.ShippingCity,
            State = order.ShippingState,
            PostalCode = order.ShippingPostalCode,
            Country = order.ShippingCountry,
        },
        Subtotal = order.Subtotal,
        Tax = order.Tax,
        Shipping = order.Shipping,
        Total = order.Total,
        Currency = order.Currency,
        CreatedAt = order.CreatedAt,
        CustomerName = includeCustomer && order.User != null ? $"{order.User.FirstName} {order.User.LastName}" : null,
        CustomerEmail = includeCustomer ? order.User?.Email : null,
    };
}
