using FurnitureShop.Api.Authentication;
using FurnitureShop.Api.Configuration;
using FurnitureShop.Api.DTOs.Auth;
using FurnitureShop.Api.Entities;
using FurnitureShop.Api.Middleware;
using FurnitureShop.Api.Repositories.Interfaces;
using FurnitureShop.Api.Services.Interfaces;
using Microsoft.Extensions.Options;

namespace FurnitureShop.Api.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly JwtOptions _jwtOptions;

    public AuthService(
        IUserRepository userRepository,
        IRefreshTokenRepository refreshTokenRepository,
        IPasswordHasher passwordHasher,
        IJwtTokenService jwtTokenService,
        IOptions<JwtOptions> jwtOptions)
    {
        _userRepository = userRepository;
        _refreshTokenRepository = refreshTokenRepository;
        _passwordHasher = passwordHasher;
        _jwtTokenService = jwtTokenService;
        _jwtOptions = jwtOptions.Value;
    }

    public async Task<AuthSessionDto> RegisterAsync(RegisterRequest request, CancellationToken ct = default)
    {
        if (await _userRepository.EmailExistsAsync(request.Email, ct))
        {
            throw new ConflictException("An account with this email already exists.");
        }

        var user = new User
        {
            Email = request.Email.Trim().ToLowerInvariant(),
            PasswordHash = _passwordHasher.Hash(request.Password),
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Role = UserRole.Customer,
        };

        await _userRepository.AddAsync(user, ct);
        await _userRepository.SaveChangesAsync(ct);

        return await BuildSessionAsync(user, ct);
    }

    public async Task<AuthSessionDto> LoginAsync(LoginRequest request, CancellationToken ct = default)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email, ct);

        if (user == null || !user.IsActive || !_passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            throw new AppException("Invalid email or password.", System.Net.HttpStatusCode.Unauthorized);
        }

        return await BuildSessionAsync(user, ct);
    }

    public async Task<AuthTokensDto> RefreshAsync(string refreshToken, CancellationToken ct = default)
    {
        var tokenHash = _jwtTokenService.HashToken(refreshToken);
        var storedToken = await _refreshTokenRepository.GetByTokenHashAsync(tokenHash, ct);

        if (storedToken == null || !storedToken.IsActive)
        {
            throw new AppException("Invalid or expired refresh token.", System.Net.HttpStatusCode.Unauthorized);
        }

        // Rotate: revoke the used token and issue a new pair.
        storedToken.RevokedAt = DateTime.UtcNow;

        var (rawToken, newTokenHash, expiresAt) = _jwtTokenService.GenerateRefreshToken();
        storedToken.ReplacedByTokenHash = newTokenHash;

        await _refreshTokenRepository.AddAsync(new RefreshToken
        {
            UserId = storedToken.UserId,
            TokenHash = newTokenHash,
            ExpiresAt = expiresAt,
        }, ct);

        await _refreshTokenRepository.SaveChangesAsync(ct);

        var accessToken = _jwtTokenService.GenerateAccessToken(storedToken.User);

        return new AuthTokensDto
        {
            AccessToken = accessToken,
            RefreshToken = rawToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(_jwtOptions.AccessTokenExpirationMinutes),
        };
    }

    public async Task LogoutAsync(Guid userId, CancellationToken ct = default)
    {
        await _refreshTokenRepository.RevokeAllForUserAsync(userId, ct);
        await _refreshTokenRepository.SaveChangesAsync(ct);
    }

    public async Task<UserDto> GetCurrentUserAsync(Guid userId, CancellationToken ct = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, ct)
            ?? throw new NotFoundException("User not found.");

        return ToDto(user);
    }

    public Task RequestPasswordResetAsync(string email, CancellationToken ct = default)
    {
        // Intentionally does not reveal whether the email exists (avoids
        // user enumeration). Real implementation would email a signed,
        // time-limited reset token here.
        return Task.CompletedTask;
    }

    public Task ResetPasswordAsync(string token, string newPassword, CancellationToken ct = default)
    {
        // Placeholder for the token-verification + password update flow —
        // wire up once the password-reset token store/email sender exists.
        throw new NotFoundException("Password reset token is invalid or has expired.");
    }

    private async Task<AuthSessionDto> BuildSessionAsync(User user, CancellationToken ct)
    {
        var accessToken = _jwtTokenService.GenerateAccessToken(user);
        var (rawRefreshToken, tokenHash, expiresAt) = _jwtTokenService.GenerateRefreshToken();

        await _refreshTokenRepository.AddAsync(new RefreshToken
        {
            UserId = user.Id,
            TokenHash = tokenHash,
            ExpiresAt = expiresAt,
        }, ct);
        await _refreshTokenRepository.SaveChangesAsync(ct);

        return new AuthSessionDto
        {
            User = ToDto(user),
            Tokens = new AuthTokensDto
            {
                AccessToken = accessToken,
                RefreshToken = rawRefreshToken,
                ExpiresAt = DateTime.UtcNow.AddMinutes(_jwtOptions.AccessTokenExpirationMinutes),
            },
        };
    }

    private static UserDto ToDto(User user) => new()
    {
        Id = user.Id,
        Email = user.Email,
        FirstName = user.FirstName,
        LastName = user.LastName,
        Role = user.Role.ToString().ToLowerInvariant(),
        AvatarUrl = user.AvatarUrl,
        EmailVerified = user.EmailVerified,
        CreatedAt = user.CreatedAt,
    };
}
