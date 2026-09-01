using FurnitureShop.Api.DTOs.Common;
using FurnitureShop.Api.DTOs.Products;

namespace FurnitureShop.Api.Services.Interfaces;

public interface IProductService
{
    Task<PaginatedResponse<ProductListItemDto>> SearchAsync(ProductFilterQuery filters, PaginationParams pagination, CancellationToken ct = default);
    Task<ProductDto> GetBySlugAsync(string slug, CancellationToken ct = default);
    Task<List<ProductListItemDto>> GetFeaturedAsync(CancellationToken ct = default);
    Task<List<CategoryDto>> GetCategoriesAsync(CancellationToken ct = default);
    Task<List<ProductReviewDto>> GetReviewsAsync(Guid productId, CancellationToken ct = default);
    Task<ProductReviewDto> AddReviewAsync(Guid productId, Guid userId, CreateReviewRequest request, CancellationToken ct = default);
    Task<ProductDto> CreateAsync(CreateProductRequest request, CancellationToken ct = default);
    Task<ProductDto> UpdateAsync(Guid id, UpdateProductRequest request, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}
