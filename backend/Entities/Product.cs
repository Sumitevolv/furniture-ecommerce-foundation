namespace FurnitureShop.Api.Entities;

public enum ProductAvailability
{
    InStock = 0,
    LowStock = 1,
    OutOfStock = 2,
    Preorder = 3
}

public class Product : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ShortDescription { get; set; }

    public decimal Price { get; set; }
    public decimal? CompareAtPrice { get; set; }
    public string Currency { get; set; } = "INR";

    public Guid CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    public string? Material { get; set; }
    public decimal? WidthCm { get; set; }
    public decimal? HeightCm { get; set; }
    public decimal? DepthCm { get; set; }

    public ProductAvailability Availability { get; set; } = ProductAvailability.InStock;
    public int StockQuantity { get; set; }

    public decimal Rating { get; set; }
    public int ReviewCount { get; set; }

    public string[] Tags { get; set; } = Array.Empty<string>();
    public bool IsFeatured { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
    public ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
    public ICollection<ProductReview> Reviews { get; set; } = new List<ProductReview>();
}

public class ProductImage : BaseEntity
{
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public string Url { get; set; } = string.Empty;
    public string? AltText { get; set; }
    public bool IsPrimary { get; set; }
    public int SortOrder { get; set; }

    /// <summary>Storage provider identifier (e.g. Cloudinary public_id or S3 key) for deletion/replacement.</summary>
    public string? StorageKey { get; set; }
}

public class ProductVariant : BaseEntity
{
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public string Name { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public decimal? PriceOverride { get; set; }
    public int StockQuantity { get; set; }

    /// <summary>e.g. {"color":"Walnut","size":"3-seater"} stored as JSON.</summary>
    public Dictionary<string, string> Attributes { get; set; } = new();
}

public class ProductReview : BaseEntity
{
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public int Rating { get; set; }
    public string? Title { get; set; }
    public string Comment { get; set; } = string.Empty;
    public bool IsVerifiedPurchase { get; set; }
}
