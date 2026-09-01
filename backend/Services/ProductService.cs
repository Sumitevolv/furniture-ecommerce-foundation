using FurnitureShop.Api.DTOs.Common;
using FurnitureShop.Api.DTOs.Products;
using FurnitureShop.Api.Entities;
using FurnitureShop.Api.Helpers;
using FurnitureShop.Api.Integrations.SignalR;
using FurnitureShop.Api.Middleware;
using FurnitureShop.Api.Repositories.Interfaces;
using FurnitureShop.Api.Services.Interfaces;

namespace FurnitureShop.Api.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IUserRepository _userRepository;
    private readonly INotificationService _notificationService;

    private const int LowStockThreshold = 5;

    public ProductService(
        IProductRepository productRepository,
        ICategoryRepository categoryRepository,
        IUserRepository userRepository,
        INotificationService notificationService)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
        _userRepository = userRepository;
        _notificationService = notificationService;
    }

    public async Task<PaginatedResponse<ProductListItemDto>> SearchAsync(
        ProductFilterQuery filters, PaginationParams pagination, CancellationToken ct = default)
    {
        var (items, totalCount) = await _productRepository.SearchAsync(filters, pagination, ct);

        return new PaginatedResponse<ProductListItemDto>
        {
            Items = items.Select(ToListItemDto).ToList(),
            Page = pagination.Page,
            PageSize = pagination.PageSize,
            TotalItems = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pagination.PageSize),
        };
    }

    public async Task<ProductDto> GetBySlugAsync(string slug, CancellationToken ct = default)
    {
        var product = await _productRepository.GetBySlugAsync(slug, ct)
            ?? throw new NotFoundException($"No product found with slug '{slug}'.");

        return ToDto(product);
    }

    public async Task<List<ProductListItemDto>> GetFeaturedAsync(CancellationToken ct = default)
    {
        var products = await _productRepository.GetFeaturedAsync(ct: ct);
        return products.Select(ToListItemDto).ToList();
    }

    public async Task<List<CategoryDto>> GetCategoriesAsync(CancellationToken ct = default)
    {
        var categories = await _categoryRepository.GetAllAsync(ct);
        return categories.Select(c => new CategoryDto
        {
            Id = c.Id,
            Name = c.Name,
            Slug = c.Slug,
            Description = c.Description,
            ImageUrl = c.ImageUrl,
            ParentId = c.ParentId,
        }).ToList();
    }

    public async Task<List<ProductReviewDto>> GetReviewsAsync(Guid productId, CancellationToken ct = default)
    {
        var product = await _productRepository.GetByIdWithDetailsAsync(productId, ct)
            ?? throw new NotFoundException("Product not found.");

        return product.Reviews.Select(r => new ProductReviewDto
        {
            Id = r.Id,
            ProductId = r.ProductId,
            UserName = $"{r.User.FirstName} {r.User.LastName[..1]}.",
            Rating = r.Rating,
            Title = r.Title,
            Comment = r.Comment,
            IsVerifiedPurchase = r.IsVerifiedPurchase,
            CreatedAt = r.CreatedAt,
        }).OrderByDescending(r => r.CreatedAt).ToList();
    }

    public async Task<ProductReviewDto> AddReviewAsync(Guid productId, Guid userId, CreateReviewRequest request, CancellationToken ct = default)
    {
        var product = await _productRepository.GetByIdAsync(productId, ct)
            ?? throw new NotFoundException("Product not found.");
        var user = await _userRepository.GetByIdAsync(userId, ct)
            ?? throw new NotFoundException("User not found.");

        if (request.Rating is < 1 or > 5)
        {
            throw new AppException("Rating must be between 1 and 5.");
        }

        var review = new ProductReview
        {
            ProductId = productId,
            UserId = userId,
            Rating = request.Rating,
            Title = request.Title,
            Comment = request.Comment,
            IsVerifiedPurchase = false, // TODO: check order history once order lookups are wired here
        };

        product.Reviews.Add(review);

        // Recompute the running rating/review count so listing pages stay accurate.
        var allRatings = product.Reviews.Select(r => r.Rating).Append(request.Rating).ToList();
        product.ReviewCount = allRatings.Count;
        product.Rating = Math.Round((decimal)allRatings.Average(), 2);

        await _productRepository.SaveChangesAsync(ct);

        return new ProductReviewDto
        {
            Id = review.Id,
            ProductId = productId,
            UserName = $"{user.FirstName} {user.LastName[..1]}.",
            Rating = review.Rating,
            Title = review.Title,
            Comment = review.Comment,
            IsVerifiedPurchase = review.IsVerifiedPurchase,
            CreatedAt = review.CreatedAt,
        };
    }

    public async Task<ProductDto> CreateAsync(CreateProductRequest request, CancellationToken ct = default)
    {
        var category = await _categoryRepository.GetByIdAsync(request.CategoryId, ct)
            ?? throw new NotFoundException("Category not found.");

        var slug = await GenerateUniqueSlugAsync(request.Name, ct);

        var product = new Product
        {
            Name = request.Name,
            Slug = slug,
            Description = request.Description,
            ShortDescription = request.ShortDescription,
            Price = request.Price,
            CompareAtPrice = request.CompareAtPrice,
            CategoryId = request.CategoryId,
            Material = request.Material,
            StockQuantity = request.StockQuantity,
            Availability = request.StockQuantity > 0 ? ProductAvailability.InStock : ProductAvailability.OutOfStock,
            Tags = request.Tags?.ToArray() ?? Array.Empty<string>(),
            IsFeatured = request.IsFeatured,
        };

        await _productRepository.AddAsync(product, ct);
        await _productRepository.SaveChangesAsync(ct);

        product.Category = category;
        return ToDto(product);
    }

    public async Task<ProductDto> UpdateAsync(Guid id, UpdateProductRequest request, CancellationToken ct = default)
    {
        var product = await _productRepository.GetByIdWithDetailsAsync(id, ct)
            ?? throw new NotFoundException("Product not found.");

        var category = await _categoryRepository.GetByIdAsync(request.CategoryId, ct)
            ?? throw new NotFoundException("Category not found.");

        product.Name = request.Name;
        product.Description = request.Description;
        product.ShortDescription = request.ShortDescription;
        product.Price = request.Price;
        product.CompareAtPrice = request.CompareAtPrice;
        product.CategoryId = request.CategoryId;
        product.Category = category;
        product.Material = request.Material;
        product.StockQuantity = request.StockQuantity;
        product.Tags = request.Tags?.ToArray() ?? Array.Empty<string>();
        product.IsFeatured = request.IsFeatured;
        product.IsActive = request.IsActive;
        product.Availability = request.StockQuantity switch
        {
            0 => ProductAvailability.OutOfStock,
            <= LowStockThreshold => ProductAvailability.LowStock,
            _ => ProductAvailability.InStock,
        };

        await _productRepository.SaveChangesAsync(ct);

        if (product.StockQuantity <= LowStockThreshold && product.StockQuantity > 0)
        {
            await _notificationService.NotifyLowStockAsync(product.Id, product.Name, product.StockQuantity, ct);
        }

        return ToDto(product);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var product = await _productRepository.GetByIdAsync(id, ct)
            ?? throw new NotFoundException("Product not found.");

        // Soft delete: keep historical order-item references intact.
        product.IsActive = false;
        await _productRepository.SaveChangesAsync(ct);
    }

    private async Task<string> GenerateUniqueSlugAsync(string name, CancellationToken ct)
    {
        var baseSlug = SlugHelper.GenerateSlug(name);
        var slug = baseSlug;
        var suffix = 1;

        while (await _productRepository.SlugExistsAsync(slug, ct))
        {
            slug = $"{baseSlug}-{++suffix}";
        }

        return slug;
    }

    private static ProductListItemDto ToListItemDto(Product p) => new()
    {
        Id = p.Id,
        Name = p.Name,
        Slug = p.Slug,
        Price = p.Price,
        CompareAtPrice = p.CompareAtPrice,
        Currency = p.Currency,
        Images = p.Images.OrderBy(i => i.SortOrder).Select(ToImageDto).ToList(),
        Availability = p.Availability.ToString().ToLowerInvariant(),
        Rating = p.Rating,
        ReviewCount = p.ReviewCount,
        IsFeatured = p.IsFeatured,
        CategoryName = p.Category.Name,
    };

    private static ProductDto ToDto(Product p) => new()
    {
        Id = p.Id,
        Name = p.Name,
        Slug = p.Slug,
        Description = p.Description,
        ShortDescription = p.ShortDescription,
        Price = p.Price,
        CompareAtPrice = p.CompareAtPrice,
        Currency = p.Currency,
        Category = new CategoryDto
        {
            Id = p.Category.Id,
            Name = p.Category.Name,
            Slug = p.Category.Slug,
            Description = p.Category.Description,
            ImageUrl = p.Category.ImageUrl,
            ParentId = p.Category.ParentId,
        },
        Material = p.Material,
        Dimensions = p.WidthCm.HasValue && p.HeightCm.HasValue && p.DepthCm.HasValue
            ? new ProductDimensionsDto { WidthCm = p.WidthCm.Value, HeightCm = p.HeightCm.Value, DepthCm = p.DepthCm.Value }
            : null,
        Images = p.Images.OrderBy(i => i.SortOrder).Select(ToImageDto).ToList(),
        Variants = p.Variants.Select(v => new ProductVariantDto
        {
            Id = v.Id,
            Name = v.Name,
            Sku = v.Sku,
            PriceOverride = v.PriceOverride,
            StockQuantity = v.StockQuantity,
            Attributes = v.Attributes,
        }).ToList(),
        Availability = p.Availability.ToString().ToLowerInvariant(),
        StockQuantity = p.StockQuantity,
        Rating = p.Rating,
        ReviewCount = p.ReviewCount,
        Tags = p.Tags.ToList(),
        IsFeatured = p.IsFeatured,
        CreatedAt = p.CreatedAt,
        UpdatedAt = p.UpdatedAt,
    };

    private static ProductImageDto ToImageDto(ProductImage i) => new()
    {
        Id = i.Id,
        Url = i.Url,
        AltText = i.AltText,
        IsPrimary = i.IsPrimary,
        SortOrder = i.SortOrder,
    };
}
