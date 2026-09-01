namespace FurnitureShop.Api.Configuration;

public class RazorpayOptions
{
    public const string SectionName = "Razorpay";

    public string KeyId { get; set; } = string.Empty;
    public string KeySecret { get; set; } = string.Empty;
    /// <summary>Shared secret used to verify incoming Razorpay webhook signatures.</summary>
    public string WebhookSecret { get; set; } = string.Empty;
}
