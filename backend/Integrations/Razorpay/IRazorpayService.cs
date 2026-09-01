namespace FurnitureShop.Api.Integrations.Razorpay;

public record RazorpayOrderResult(string RazorpayOrderId, decimal Amount, string Currency);

public interface IRazorpayService
{
    /// <summary>Creates a Razorpay order for the given amount (in the smallest currency unit is handled internally).</summary>
    Task<RazorpayOrderResult> CreateOrderAsync(decimal amount, string currency, string receipt, CancellationToken ct = default);

    /// <summary>Verifies the HMAC-SHA256 signature Razorpay's checkout.js returns after a successful payment.</summary>
    bool VerifyPaymentSignature(string razorpayOrderId, string razorpayPaymentId, string razorpaySignature);

    /// <summary>Verifies the signature on an incoming webhook payload against the configured webhook secret.</summary>
    bool VerifyWebhookSignature(string payload, string signatureHeader);
}
