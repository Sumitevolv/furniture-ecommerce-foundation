using FurnitureShop.Api.Data;
using FurnitureShop.Api.Entities;
using FurnitureShop.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FurnitureShop.Api.Repositories;

public class RefreshTokenRepository : Repository<RefreshToken>, IRefreshTokenRepository
{
    public RefreshTokenRepository(AppDbContext context) : base(context) { }

    public Task<RefreshToken?> GetByTokenHashAsync(string tokenHash, CancellationToken ct = default) =>
        DbSet.Include(t => t.User).FirstOrDefaultAsync(t => t.TokenHash == tokenHash, ct);

    public async Task RevokeAllForUserAsync(Guid userId, CancellationToken ct = default)
    {
        var tokens = await DbSet.Where(t => t.UserId == userId && t.RevokedAt == null).ToListAsync(ct);
        foreach (var token in tokens)
        {
            token.RevokedAt = DateTime.UtcNow;
        }
    }
}
