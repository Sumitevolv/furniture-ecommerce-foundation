namespace FurnitureShop.Api.DTOs.Payments;

public record InitiatePaymentRequest(Guid OrderId);

public class PaymentInitResponseDto
{
    public string RazorpayOrderId { get; set; } = string.Empty;
    public string RazorpayKeyId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "INR";
    public Guid OrderId { get; set; }
}

public record VerifyPaymentRequest(
    Guid OrderId,
    string RazorpayOrderId,
    string RazorpayPaymentId,
    string RazorpaySignature);

/// <summary>Payload shape Razorpay posts to the configured webhook URL.</summary>
public class RazorpayWebhookPayload
{
    public string Event { get; set; } = string.Empty;
    public object? Payload { get; set; }
}
