using System.Linq.Expressions;

namespace FurnitureShop.Api.Repositories.Interfaces;

/// <summary>
/// Generic data-access contract. Concrete repositories add domain-specific
/// query methods on top of this (e.g. IProductRepository.GetBySlugAsync).
/// </summary>
public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<List<T>> GetAllAsync(CancellationToken ct = default);
    Task<List<T>> FindAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default);
    Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default);
    Task AddAsync(T entity, CancellationToken ct = default);
    void Update(T entity);
    void Remove(T entity);
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
