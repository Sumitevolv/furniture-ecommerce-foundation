namespace FurnitureShop.Api.DTOs.Products;

public class CategoryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public Guid? ParentId { get; set; }
}

public class ProductImageDto
{
    public Guid Id { get; set; }
    public string Url { get; set; } = string.Empty;
    public string? AltText { get; set; }
    public bool IsPrimary { get; set; }
    public int SortOrder { get; set; }
}

public class ProductVariantDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public decimal? PriceOverride { get; set; }
    public int StockQuantity { get; set; }
    public Dictionary<string, string> Attributes { get; set; } = new();
}

public class ProductDimensionsDto
{
    public decimal WidthCm { get; set; }
    public decimal HeightCm { get; set; }
    public decimal DepthCm { get; set; }
}

public class ProductDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ShortDescription { get; set; }
    public decimal Price { get; set; }
    public decimal? CompareAtPrice { get; set; }
    public string Currency { get; set; } = "INR";
    public CategoryDto Category { get; set; } = null!;
    public string? Material { get; set; }
    public ProductDimensionsDto? Dimensions { get; set; }
    public List<ProductImageDto> Images { get; set; } = new();
    public List<ProductVariantDto> Variants { get; set; } = new();
    public string Availability { get; set; } = string.Empty;
    public int StockQuantity { get; set; }
    public decimal Rating { get; set; }
    public int ReviewCount { get; set; }
    public List<string> Tags { get; set; } = new();
    public bool IsFeatured { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class ProductListItemDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? CompareAtPrice { get; set; }
    public string Currency { get; set; } = "INR";
    public List<ProductImageDto> Images { get; set; } = new();
    public string Availability { get; set; } = string.Empty;
    public decimal Rating { get; set; }
    public int ReviewCount { get; set; }
    public bool IsFeatured { get; set; }
    public string CategoryName { get; set; } = string.Empty;
}

public class ProductFilterQuery
{
    public string? CategorySlug { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public string? Material { get; set; }
    public bool? InStockOnly { get; set; }
    public string? Search { get; set; }
}

public class ProductReviewDto
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string? Title { get; set; }
    public string Comment { get; set; } = string.Empty;
    public bool IsVerifiedPurchase { get; set; }
    public DateTime CreatedAt { get; set; }
}

public record CreateReviewRequest(int Rating, string? Title, string Comment);

public record CreateProductRequest(
    string Name,
    string Description,
    string? ShortDescription,
    decimal Price,
    decimal? CompareAtPrice,
    Guid CategoryId,
    string? Material,
    int StockQuantity,
    List<string>? Tags,
    bool IsFeatured);

public record UpdateProductRequest(
    string Name,
    string Description,
    string? ShortDescription,
    decimal Price,
    decimal? CompareAtPrice,
    Guid CategoryId,
    string? Material,
    int StockQuantity,
    List<string>? Tags,
    bool IsFeatured,
    bool IsActive);
