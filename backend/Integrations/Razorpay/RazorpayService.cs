using System.Security.Cryptography;
using System.Text;
using FurnitureShop.Api.Configuration;
using Microsoft.Extensions.Options;
using RazorpayClient = Razorpay.Api;

namespace FurnitureShop.Api.Integrations.Razorpay;

/// <summary>
/// Wraps the Razorpay .NET SDK behind IRazorpayService. Order creation goes
/// through the SDK; signature verification is done manually via HMAC-SHA256
/// per Razorpay's documented scheme, so it has no network dependency and
/// can be unit tested without hitting the Razorpay API.
/// </summary>
public class RazorpayService : IRazorpayService
{
    private readonly RazorpayOptions _options;
    private readonly RazorpayClient.RazorpayClient _client;

    public RazorpayService(IOptions<RazorpayOptions> options)
    {
        _options = options.Value;
        _client = new RazorpayClient.RazorpayClient(_options.KeyId, _options.KeySecret);
    }

    public Task<RazorpayOrderResult> CreateOrderAsync(decimal amount, string currency, string receipt, CancellationToken ct = default)
    {
        // Razorpay expects amount in the smallest currency unit (e.g. paise for INR).
        var amountInSubunits = (int)Math.Round(amount * 100, MidpointRounding.AwayFromZero);

        var options = new Dictionary<string, object>
        {
            { "amount", amountInSubunits },
            { "currency", currency },
            { "receipt", receipt },
            { "payment_capture", 1 },
        };

        var order = _client.Order.Create(options);
        var razorpayOrderId = (string)order.Attributes["id"];

        return Task.FromResult(new RazorpayOrderResult(razorpayOrderId, amount, currency));
    }

    public bool VerifyPaymentSignature(string razorpayOrderId, string razorpayPaymentId, string razorpaySignature)
    {
        var payload = $"{razorpayOrderId}|{razorpayPaymentId}";
        var expectedSignature = ComputeHmacSha256(payload, _options.KeySecret);
        return SignaturesMatch(expectedSignature, razorpaySignature);
    }

    public bool VerifyWebhookSignature(string payload, string signatureHeader)
    {
        var expectedSignature = ComputeHmacSha256(payload, _options.WebhookSecret);
        return SignaturesMatch(expectedSignature, signatureHeader);
    }

    private static string ComputeHmacSha256(string payload, string secret)
    {
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
        return Convert.ToHexString(hash).ToLowerInvariant();
    }

    /// <summary>Constant-time comparison to avoid leaking signature validity via timing side-channels.</summary>
    private static bool SignaturesMatch(string expected, string actual)
    {
        if (expected.Length != actual.Length) return false;
        return CryptographicOperations.FixedTimeEquals(Encoding.UTF8.GetBytes(expected), Encoding.UTF8.GetBytes(actual));
    }
}
