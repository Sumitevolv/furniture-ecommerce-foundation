namespace FurnitureShop.Api.Entities;

/// <summary>
/// Opaque refresh token issued alongside a short-lived JWT access token.
/// Stored hashed; used to mint a new access token without re-authentication.
/// </summary>
public class RefreshToken : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public string TokenHash { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public DateTime? RevokedAt { get; set; }
    public string? ReplacedByTokenHash { get; set; }

    public bool IsActive => RevokedAt == null && DateTime.UtcNow < ExpiresAt;
}
