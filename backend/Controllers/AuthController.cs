using FurnitureShop.Api.Authentication;
using FurnitureShop.Api.DTOs.Auth;
using FurnitureShop.Api.DTOs.Common;
using FurnitureShop.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FurnitureShop.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ICurrentUserService _currentUser;

    public AuthController(IAuthService authService, ICurrentUserService currentUser)
    {
        _authService = authService;
        _currentUser = currentUser;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken ct)
    {
        var session = await _authService.RegisterAsync(request, ct);
        return Ok(ApiResponse<AuthSessionDto>.Ok(session, "Account created."));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken ct)
    {
        var session = await _authService.LoginAsync(request, ct);
        return Ok(ApiResponse<AuthSessionDto>.Ok(session, "Welcome back."));
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest request, CancellationToken ct)
    {
        var tokens = await _authService.RefreshAsync(request.RefreshToken, ct);
        return Ok(ApiResponse<AuthTokensDto>.Ok(tokens));
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout(CancellationToken ct)
    {
        await _authService.LogoutAsync(_currentUser.UserId!.Value, ct);
        return Ok(ApiResponse<object?>.Ok(null, "Logged out."));
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me(CancellationToken ct)
    {
        var user = await _authService.GetCurrentUserAsync(_currentUser.UserId!.Value, ct);
        return Ok(ApiResponse<UserDto>.Ok(user));
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request, CancellationToken ct)
    {
        await _authService.RequestPasswordResetAsync(request.Email, ct);
        return Ok(ApiResponse<object?>.Ok(null, "If that email is registered, a reset link has been sent."));
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request, CancellationToken ct)
    {
        await _authService.ResetPasswordAsync(request.Token, request.NewPassword, ct);
        return Ok(ApiResponse<object?>.Ok(null, "Password updated."));
    }
}
