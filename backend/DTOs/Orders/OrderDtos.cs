namespace FurnitureShop.Api.DTOs.Orders;

public class AddressDto
{
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Line1 { get; set; } = string.Empty;
    public string? Line2 { get; set; }
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
}

public class OrderItemDto
{
    public Guid Id { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string? ProductImageUrl { get; set; }
    public string? VariantLabel { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal LineTotal { get; set; }
}

public class OrderDto
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public List<OrderItemDto> Items { get; set; } = new();
    public string Status { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
    public AddressDto ShippingAddress { get; set; } = null!;
    public decimal Subtotal { get; set; }
    public decimal Tax { get; set; }
    public decimal Shipping { get; set; }
    public decimal Total { get; set; }
    public string Currency { get; set; } = "INR";
    public DateTime CreatedAt { get; set; }

    /// <summary>Populated only on admin listing endpoints — omitted for a customer's own order views.</summary>
    public string? CustomerName { get; set; }
    public string? CustomerEmail { get; set; }
}

public record CreateOrderRequest(AddressDto ShippingAddress, AddressDto? BillingAddress, string? Notes);
