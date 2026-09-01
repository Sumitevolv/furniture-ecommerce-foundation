using System.Text.Json;
using FurnitureShop.Api.Configuration;
using FurnitureShop.Api.DTOs.Payments;
using FurnitureShop.Api.Entities;
using FurnitureShop.Api.Integrations.Razorpay;
using FurnitureShop.Api.Integrations.SignalR;
using FurnitureShop.Api.Middleware;
using FurnitureShop.Api.Repositories.Interfaces;
using FurnitureShop.Api.Services.Interfaces;
using Microsoft.Extensions.Options;

namespace FurnitureShop.Api.Services;

public class PaymentService : IPaymentService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IPaymentRepository _paymentRepository;
    private readonly IRazorpayService _razorpayService;
    private readonly INotificationService _notificationService;
    private readonly RazorpayOptions _razorpayOptions;
    private readonly ILogger<PaymentService> _logger;

    public PaymentService(
        IOrderRepository orderRepository,
        IPaymentRepository paymentRepository,
        IRazorpayService razorpayService,
        INotificationService notificationService,
        IOptions<RazorpayOptions> razorpayOptions,
        ILogger<PaymentService> logger)
    {
        _orderRepository = orderRepository;
        _paymentRepository = paymentRepository;
        _razorpayService = razorpayService;
        _notificationService = notificationService;
        _razorpayOptions = razorpayOptions.Value;
        _logger = logger;
    }

    public async Task<PaymentInitResponseDto> InitiatePaymentAsync(Guid userId, Guid orderId, CancellationToken ct = default)
    {
        var order = await _orderRepository.GetByIdWithDetailsAsync(orderId, ct)
            ?? throw new NotFoundException("Order not found.");

        if (order.UserId != userId)
        {
            throw new UnauthorizedAccessException();
        }

        if (order.PaymentStatus == PaymentStatus.Paid)
        {
            throw new AppException("This order has already been paid.");
        }

        var razorpayOrder = await _razorpayService.CreateOrderAsync(order.Total, order.Currency, order.OrderNumber, ct);

        var payment = order.Payment;
        if (payment == null)
        {
            payment = new Payment
            {
                OrderId = order.Id,
                RazorpayOrderId = razorpayOrder.RazorpayOrderId,
                Amount = order.Total,
                Currency = order.Currency,
                Status = PaymentStatus.Pending,
            };
            await _paymentRepository.AddAsync(payment, ct);
        }
        else
        {
            payment.RazorpayOrderId = razorpayOrder.RazorpayOrderId;
            payment.Status = PaymentStatus.Pending;
        }

        await _paymentRepository.SaveChangesAsync(ct);

        return new PaymentInitResponseDto
        {
            RazorpayOrderId = razorpayOrder.RazorpayOrderId,
            RazorpayKeyId = _razorpayOptions.KeyId,
            Amount = order.Total,
            Currency = order.Currency,
            OrderId = order.Id,
        };
    }

    public async Task<bool> VerifyPaymentAsync(Guid userId, VerifyPaymentRequest request, CancellationToken ct = default)
    {
        var order = await _orderRepository.GetByIdWithDetailsAsync(request.OrderId, ct)
            ?? throw new NotFoundException("Order not found.");

        if (order.UserId != userId)
        {
            throw new UnauthorizedAccessException();
        }

        var isValid = _razorpayService.VerifyPaymentSignature(
            request.RazorpayOrderId, request.RazorpayPaymentId, request.RazorpaySignature);

        var payment = order.Payment ?? throw new NotFoundException("Payment record not found for this order.");

        if (!isValid)
        {
            payment.Status = PaymentStatus.Failed;
            payment.FailureReason = "Signature verification failed.";
            order.PaymentStatus = PaymentStatus.Failed;
            await _orderRepository.SaveChangesAsync(ct);
            return false;
        }

        payment.RazorpayPaymentId = request.RazorpayPaymentId;
        payment.RazorpaySignature = request.RazorpaySignature;
        payment.Status = PaymentStatus.Paid;
        payment.PaidAt = DateTime.UtcNow;

        order.PaymentStatus = PaymentStatus.Paid;
        order.Status = OrderStatus.Confirmed;

        await _orderRepository.SaveChangesAsync(ct);
        await _notificationService.NotifyOrderStatusChangedAsync(order.UserId, order.Id, order.Status.ToString(), ct);

        return true;
    }

    public async Task HandleWebhookAsync(string rawPayload, string signatureHeader, CancellationToken ct = default)
    {
        if (!_razorpayService.VerifyWebhookSignature(rawPayload, signatureHeader))
        {
            _logger.LogWarning("Rejected Razorpay webhook with invalid signature");
            throw new AppException("Invalid webhook signature.", System.Net.HttpStatusCode.Unauthorized);
        }

        using var document = JsonDocument.Parse(rawPayload);
        var eventType = document.RootElement.GetProperty("event").GetString();

        _logger.LogInformation("Received verified Razorpay webhook: {EventType}", eventType);

        // Webhook-driven reconciliation (e.g. "payment.captured", "payment.failed")
        // would look up the Payment by RazorpayOrderId here and update status —
        // stubbed pending the full payload contract for each event type.
        await Task.CompletedTask;
    }
}
