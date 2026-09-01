using FurnitureShop.Api.Entities;

namespace FurnitureShop.Api.Repositories.Interfaces;

public interface ICategoryRepository : IRepository<Category>
{
    Task<Category?> GetBySlugAsync(string slug, CancellationToken ct = default);
}
