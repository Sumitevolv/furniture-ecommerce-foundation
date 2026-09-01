using FurnitureShop.Api.Entities;

namespace FurnitureShop.Api.Repositories.Interfaces;

public interface IPaymentRepository : IRepository<Payment>
{
    Task<Payment?> GetByRazorpayOrderIdAsync(string razorpayOrderId, CancellationToken ct = default);
    Task<Payment?> GetByOrderIdAsync(Guid orderId, CancellationToken ct = default);
}
