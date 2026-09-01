using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using FurnitureShop.Api.Configuration;
using FurnitureShop.Api.Entities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace FurnitureShop.Api.Authentication;

public interface IJwtTokenService
{
    string GenerateAccessToken(User user);
    (string RawToken, string TokenHash, DateTime ExpiresAt) GenerateRefreshToken();
    string HashToken(string rawToken);
    ClaimsPrincipal? ValidateAccessToken(string token);
}

/// <summary>
/// Issues short-lived JWT access tokens and long-lived opaque refresh
/// tokens (stored only as a hash — see RefreshToken entity). This class is
/// the single place JWT signing/validation logic lives.
/// </summary>
public class JwtTokenService : IJwtTokenService
{
    private readonly JwtOptions _options;

    public JwtTokenService(IOptions<JwtOptions> options)
    {
        _options = options.Value;
    }

    public string GenerateAccessToken(User user)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.Secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _options.Issuer,
            audience: _options.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_options.AccessTokenExpirationMinutes),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public (string RawToken, string TokenHash, DateTime ExpiresAt) GenerateRefreshToken()
    {
        var rawToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        var expiresAt = DateTime.UtcNow.AddDays(_options.RefreshTokenExpirationDays);
        return (rawToken, HashToken(rawToken), expiresAt);
    }

    public string HashToken(string rawToken)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(rawToken));
        return Convert.ToHexString(bytes);
    }

    public ClaimsPrincipal? ValidateAccessToken(string token)
    {
        var handler = new JwtSecurityTokenHandler();
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.Secret));

        try
        {
            var principal = handler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = _options.Issuer,
                ValidateAudience = true,
                ValidAudience = _options.Audience,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = key,
                ClockSkew = TimeSpan.FromSeconds(30),
            }, out _);

            return principal;
        }
        catch (SecurityTokenException)
        {
            return null;
        }
    }
}
