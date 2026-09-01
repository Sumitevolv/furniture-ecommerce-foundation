using FurnitureShop.Api.DTOs.Payments;

namespace FurnitureShop.Api.Services.Interfaces;

public interface IPaymentService
{
    Task<PaymentInitResponseDto> InitiatePaymentAsync(Guid userId, Guid orderId, CancellationToken ct = default);
    Task<bool> VerifyPaymentAsync(Guid userId, VerifyPaymentRequest request, CancellationToken ct = default);
    Task HandleWebhookAsync(string rawPayload, string signatureHeader, CancellationToken ct = default);
}
