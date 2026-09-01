using FurnitureShop.Api.Data;
using FurnitureShop.Api.Entities;
using FurnitureShop.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FurnitureShop.Api.Repositories;

public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(AppDbContext context) : base(context) { }

    public Task<User?> GetByEmailAsync(string email, CancellationToken ct = default) =>
        DbSet.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower(), ct);

    public Task<bool> EmailExistsAsync(string email, CancellationToken ct = default) =>
        DbSet.AnyAsync(u => u.Email.ToLower() == email.ToLower(), ct);

    public Task<User?> GetWithAddressesAsync(Guid userId, CancellationToken ct = default) =>
        DbSet.Include(u => u.Addresses).FirstOrDefaultAsync(u => u.Id == userId, ct);

    public async Task<(List<User> Items, int TotalCount)> GetCustomersAsync(
        int page, int pageSize, string? search, CancellationToken ct = default)
    {
        var query = DbSet.Where(u => u.Role == UserRole.Customer);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.ToLower();
            query = query.Where(u =>
                u.Email.ToLower().Contains(term) ||
                u.FirstName.ToLower().Contains(term) ||
                u.LastName.ToLower().Contains(term));
        }

        query = query.OrderByDescending(u => u.CreatedAt);

        var totalCount = await query.CountAsync(ct);
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);

        return (items, totalCount);
    }

    public Task<int> CountCustomersAsync(CancellationToken ct = default) =>
        DbSet.CountAsync(u => u.Role == UserRole.Customer, ct);
}
