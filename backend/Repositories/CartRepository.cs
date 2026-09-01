using FurnitureShop.Api.Data;
using FurnitureShop.Api.Entities;
using FurnitureShop.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FurnitureShop.Api.Repositories;

public class CartRepository : Repository<Cart>, ICartRepository
{
    public CartRepository(AppDbContext context) : base(context) { }

    private IQueryable<Cart> WithItems() =>
        DbSet.Include(c => c.Items).ThenInclude(i => i.Product).ThenInclude(p => p.Images)
             .Include(c => c.Items).ThenInclude(i => i.Variant);

    public Task<Cart?> GetByUserIdAsync(Guid userId, CancellationToken ct = default) =>
        WithItems().FirstOrDefaultAsync(c => c.UserId == userId, ct);

    public Task<Cart?> GetWithItemsAsync(Guid cartId, CancellationToken ct = default) =>
        WithItems().FirstOrDefaultAsync(c => c.Id == cartId, ct);
}
