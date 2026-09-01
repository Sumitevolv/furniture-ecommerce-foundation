namespace FurnitureShop.Api.Helpers;

public static class OrderNumberHelper
{
    /// <summary>Generates a human-friendly, sortable order number, e.g. FS-20260830-4F3A2B.</summary>
    public static string Generate()
    {
        var datePart = DateTime.UtcNow.ToString("yyyyMMdd");
        var randomPart = Guid.NewGuid().ToString("N")[..6].ToUpperInvariant();
        return $"FS-{datePart}-{randomPart}";
    }
}
