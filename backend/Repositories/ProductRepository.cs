using FurnitureShop.Api.Data;
using FurnitureShop.Api.DTOs.Common;
using FurnitureShop.Api.DTOs.Products;
using FurnitureShop.Api.Entities;
using FurnitureShop.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FurnitureShop.Api.Repositories;

public class ProductRepository : Repository<Product>, IProductRepository
{
    public ProductRepository(AppDbContext context) : base(context) { }

    private IQueryable<Product> WithDetails() =>
        DbSet.Include(p => p.Category)
             .Include(p => p.Images)
             .Include(p => p.Variants);

    public Task<Product?> GetBySlugAsync(string slug, CancellationToken ct = default) =>
        WithDetails().FirstOrDefaultAsync(p => p.Slug == slug && p.IsActive, ct);

    public Task<Product?> GetByIdWithDetailsAsync(Guid id, CancellationToken ct = default) =>
        WithDetails().FirstOrDefaultAsync(p => p.Id == id, ct);

    public Task<bool> SlugExistsAsync(string slug, CancellationToken ct = default) =>
        DbSet.AnyAsync(p => p.Slug == slug, ct);

    public Task<int> CountActiveAsync(CancellationToken ct = default) =>
        DbSet.CountAsync(p => p.IsActive, ct);

    public Task<int> CountLowStockAsync(CancellationToken ct = default) =>
        DbSet.CountAsync(p => p.IsActive && p.Availability == ProductAvailability.LowStock, ct);

    public async Task<List<Product>> GetFeaturedAsync(int count = 8, CancellationToken ct = default) =>
        await WithDetails()
            .Where(p => p.IsActive && p.IsFeatured)
            .OrderByDescending(p => p.CreatedAt)
            .Take(count)
            .ToListAsync(ct);

    public async Task<(List<Product> Items, int TotalCount)> SearchAsync(
        ProductFilterQuery filters, PaginationParams pagination, CancellationToken ct = default)
    {
        var query = WithDetails().Where(p => p.IsActive);

        if (!string.IsNullOrWhiteSpace(filters.CategorySlug))
        {
            query = query.Where(p => p.Category.Slug == filters.CategorySlug);
        }

        if (filters.MinPrice.HasValue)
        {
            query = query.Where(p => p.Price >= filters.MinPrice.Value);
        }

        if (filters.MaxPrice.HasValue)
        {
            query = query.Where(p => p.Price <= filters.MaxPrice.Value);
        }

        if (!string.IsNullOrWhiteSpace(filters.Material))
        {
            query = query.Where(p => p.Material != null && p.Material.ToLower() == filters.Material.ToLower());
        }

        if (filters.InStockOnly == true)
        {
            query = query.Where(p => p.Availability != ProductAvailability.OutOfStock);
        }

        if (!string.IsNullOrWhiteSpace(filters.Search))
        {
            var term = filters.Search.ToLower();
            query = query.Where(p => p.Name.ToLower().Contains(term) || p.Description.ToLower().Contains(term));
        }

        query = ApplySort(query, pagination.SortBy, pagination.SortDirection);

        var totalCount = await query.CountAsync(ct);
        var items = await query
            .Skip((pagination.Page - 1) * pagination.PageSize)
            .Take(pagination.PageSize)
            .ToListAsync(ct);

        return (items, totalCount);
    }

    private static IQueryable<Product> ApplySort(IQueryable<Product> query, string? sortBy, string direction)
    {
        var descending = string.Equals(direction, "desc", StringComparison.OrdinalIgnoreCase);

        return sortBy?.ToLowerInvariant() switch
        {
            "price" => descending ? query.OrderByDescending(p => p.Price) : query.OrderBy(p => p.Price),
            "rating" => descending ? query.OrderByDescending(p => p.Rating) : query.OrderBy(p => p.Rating),
            "newest" => query.OrderByDescending(p => p.CreatedAt),
            _ => query.OrderByDescending(p => p.IsFeatured).ThenByDescending(p => p.CreatedAt),
        };
    }
}
