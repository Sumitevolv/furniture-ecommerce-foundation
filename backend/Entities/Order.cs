namespace FurnitureShop.Api.Entities;

public enum OrderStatus
{
    Pending = 0,
    Confirmed = 1,
    Processing = 2,
    Shipped = 3,
    Delivered = 4,
    Cancelled = 5,
    Refunded = 6
}

public enum PaymentStatus
{
    Pending = 0,
    Authorized = 1,
    Paid = 2,
    Failed = 3,
    Refunded = 4
}

public class Order : BaseEntity
{
    public string OrderNumber { get; set; } = string.Empty;

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;

    // Shipping address snapshot (kept even if the user later edits/deletes the saved address)
    public string ShippingFullName { get; set; } = string.Empty;
    public string ShippingPhone { get; set; } = string.Empty;
    public string ShippingLine1 { get; set; } = string.Empty;
    public string? ShippingLine2 { get; set; }
    public string ShippingCity { get; set; } = string.Empty;
    public string ShippingState { get; set; } = string.Empty;
    public string ShippingPostalCode { get; set; } = string.Empty;
    public string ShippingCountry { get; set; } = string.Empty;

    public decimal Subtotal { get; set; }
    public decimal Tax { get; set; }
    public decimal Shipping { get; set; }
    public decimal Total { get; set; }
    public string Currency { get; set; } = "INR";

    public string? Notes { get; set; }

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    public Payment? Payment { get; set; }
}

public class OrderItem : BaseEntity
{
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string? ProductImageUrl { get; set; }
    public string? VariantLabel { get; set; }

    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal LineTotal { get; set; }
}

/// <summary>
/// One Payment row per Order, tracking the Razorpay order/payment lifecycle.
/// </summary>
public class Payment : BaseEntity
{
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public string RazorpayOrderId { get; set; } = string.Empty;
    public string? RazorpayPaymentId { get; set; }
    public string? RazorpaySignature { get; set; }

    public decimal Amount { get; set; }
    public string Currency { get; set; } = "INR";
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

    public DateTime? PaidAt { get; set; }
    public string? FailureReason { get; set; }
}
