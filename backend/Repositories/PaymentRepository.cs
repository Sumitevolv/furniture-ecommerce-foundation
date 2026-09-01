using FurnitureShop.Api.Data;
using FurnitureShop.Api.Entities;
using FurnitureShop.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FurnitureShop.Api.Repositories;

public class PaymentRepository : Repository<Payment>, IPaymentRepository
{
    public PaymentRepository(AppDbContext context) : base(context) { }

    public Task<Payment?> GetByRazorpayOrderIdAsync(string razorpayOrderId, CancellationToken ct = default) =>
        DbSet.Include(p => p.Order).FirstOrDefaultAsync(p => p.RazorpayOrderId == razorpayOrderId, ct);

    public Task<Payment?> GetByOrderIdAsync(Guid orderId, CancellationToken ct = default) =>
        DbSet.FirstOrDefaultAsync(p => p.OrderId == orderId, ct);
}
