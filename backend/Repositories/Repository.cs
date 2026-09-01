using System.Linq.Expressions;
using FurnitureShop.Api.Data;
using FurnitureShop.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FurnitureShop.Api.Repositories;

public class Repository<T> : IRepository<T> where T : class
{
    protected readonly AppDbContext Context;
    protected readonly DbSet<T> DbSet;

    public Repository(AppDbContext context)
    {
        Context = context;
        DbSet = context.Set<T>();
    }

    public virtual async Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        await DbSet.FindAsync(new object[] { id }, ct);

    public virtual async Task<List<T>> GetAllAsync(CancellationToken ct = default) =>
        await DbSet.ToListAsync(ct);

    public virtual async Task<List<T>> FindAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default) =>
        await DbSet.Where(predicate).ToListAsync(ct);

    public virtual async Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default) =>
        await DbSet.FirstOrDefaultAsync(predicate, ct);

    public virtual async Task AddAsync(T entity, CancellationToken ct = default) =>
        await DbSet.AddAsync(entity, ct);

    public virtual void Update(T entity) => DbSet.Update(entity);

    public virtual void Remove(T entity) => DbSet.Remove(entity);

    public virtual Task<int> SaveChangesAsync(CancellationToken ct = default) => Context.SaveChangesAsync(ct);
}
