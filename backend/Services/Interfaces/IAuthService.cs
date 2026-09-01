using FurnitureShop.Api.DTOs.Auth;

namespace FurnitureShop.Api.Services.Interfaces;

public interface IAuthService
{
    Task<AuthSessionDto> RegisterAsync(RegisterRequest request, CancellationToken ct = default);
    Task<AuthSessionDto> LoginAsync(LoginRequest request, CancellationToken ct = default);
    Task<AuthTokensDto> RefreshAsync(string refreshToken, CancellationToken ct = default);
    Task LogoutAsync(Guid userId, CancellationToken ct = default);
    Task<UserDto> GetCurrentUserAsync(Guid userId, CancellationToken ct = default);
    Task RequestPasswordResetAsync(string email, CancellationToken ct = default);
    Task ResetPasswordAsync(string token, string newPassword, CancellationToken ct = default);
}
