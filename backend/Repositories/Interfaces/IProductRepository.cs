using FurnitureShop.Api.DTOs.Common;
using FurnitureShop.Api.DTOs.Products;
using FurnitureShop.Api.Entities;

namespace FurnitureShop.Api.Repositories.Interfaces;

public interface IProductRepository : IRepository<Product>
{
    Task<Product?> GetBySlugAsync(string slug, CancellationToken ct = default);
    Task<Product?> GetByIdWithDetailsAsync(Guid id, CancellationToken ct = default);
    Task<(List<Product> Items, int TotalCount)> SearchAsync(
        ProductFilterQuery filters, PaginationParams pagination, CancellationToken ct = default);
    Task<List<Product>> GetFeaturedAsync(int count = 8, CancellationToken ct = default);
    Task<bool> SlugExistsAsync(string slug, CancellationToken ct = default);
    Task<int> CountActiveAsync(CancellationToken ct = default);
    Task<int> CountLowStockAsync(CancellationToken ct = default);
}
