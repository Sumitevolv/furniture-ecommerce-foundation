using FurnitureShop.Api.Authentication;
using FurnitureShop.Api.DTOs.Common;
using FurnitureShop.Api.DTOs.Payments;
using FurnitureShop.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FurnitureShop.Api.Controllers;

[ApiController]
[Route("api/payments/razorpay")]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;
    private readonly ICurrentUserService _currentUser;
    private readonly ILogger<PaymentsController> _logger;

    public PaymentsController(IPaymentService paymentService, ICurrentUserService currentUser, ILogger<PaymentsController> logger)
    {
        _paymentService = paymentService;
        _currentUser = currentUser;
        _logger = logger;
    }

    [HttpPost("initiate")]
    [Authorize]
    public async Task<IActionResult> Initiate([FromBody] InitiatePaymentRequest request, CancellationToken ct)
    {
        var result = await _paymentService.InitiatePaymentAsync(_currentUser.UserId!.Value, request.OrderId, ct);
        return Ok(ApiResponse<PaymentInitResponseDto>.Ok(result));
    }

    [HttpPost("verify")]
    [Authorize]
    public async Task<IActionResult> Verify([FromBody] VerifyPaymentRequest request, CancellationToken ct)
    {
        var isValid = await _paymentService.VerifyPaymentAsync(_currentUser.UserId!.Value, request, ct);

        if (!isValid)
        {
            return BadRequest(ApiResponse<object?>.Fail("Payment verification failed. Please contact support if you were charged."));
        }

        return Ok(ApiResponse<object?>.Ok(null, "Payment verified."));
    }

    /// <summary>
    /// Razorpay server-to-server webhook. Not JWT-protected (Razorpay can't
    /// send a bearer token) — authenticity is instead verified via the
    /// X-Razorpay-Signature header against the configured webhook secret.
    /// </summary>
    [HttpPost("webhook")]
    [AllowAnonymous]
    public async Task<IActionResult> Webhook(CancellationToken ct)
    {
        Request.EnableBuffering();
        using var reader = new StreamReader(Request.Body, leaveOpen: true);
        var rawPayload = await reader.ReadToEndAsync(ct);
        Request.Body.Position = 0;

        var signature = Request.Headers["X-Razorpay-Signature"].ToString();

        if (string.IsNullOrEmpty(signature))
        {
            _logger.LogWarning("Razorpay webhook received without a signature header");
            return Unauthorized();
        }

        await _paymentService.HandleWebhookAsync(rawPayload, signature, ct);
        return Ok();
    }
}
