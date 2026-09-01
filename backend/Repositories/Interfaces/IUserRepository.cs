using FurnitureShop.Api.Entities;

namespace FurnitureShop.Api.Repositories.Interfaces;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email, CancellationToken ct = default);
    Task<bool> EmailExistsAsync(string email, CancellationToken ct = default);
    Task<User?> GetWithAddressesAsync(Guid userId, CancellationToken ct = default);
    Task<(List<User> Items, int TotalCount)> GetCustomersAsync(int page, int pageSize, string? search, CancellationToken ct = default);
    Task<int> CountCustomersAsync(CancellationToken ct = default);
}
