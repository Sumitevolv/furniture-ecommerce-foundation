using FurnitureShop.Api.Entities;

namespace FurnitureShop.Api.Repositories.Interfaces;

public interface IRefreshTokenRepository : IRepository<RefreshToken>
{
    Task<RefreshToken?> GetByTokenHashAsync(string tokenHash, CancellationToken ct = default);
    Task RevokeAllForUserAsync(Guid userId, CancellationToken ct = default);
}
