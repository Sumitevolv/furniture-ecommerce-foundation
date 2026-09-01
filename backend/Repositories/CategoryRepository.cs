using FurnitureShop.Api.Data;
using FurnitureShop.Api.Entities;
using FurnitureShop.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FurnitureShop.Api.Repositories;

public class CategoryRepository : Repository<Category>, ICategoryRepository
{
    public CategoryRepository(AppDbContext context) : base(context) { }

    public Task<Category?> GetBySlugAsync(string slug, CancellationToken ct = default) =>
        DbSet.FirstOrDefaultAsync(c => c.Slug == slug, ct);
}
