using FurnitureShop.Api.Entities;

namespace FurnitureShop.Api.Repositories.Interfaces;

public interface ICartRepository : IRepository<Cart>
{
    Task<Cart?> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
    Task<Cart?> GetWithItemsAsync(Guid cartId, CancellationToken ct = default);
}
