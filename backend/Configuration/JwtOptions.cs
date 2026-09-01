namespace FurnitureShop.Api.Configuration;

/// <summary>
/// Bound from the "Jwt" configuration section, which is populated from
/// environment variables in production (see .env.example / appsettings).
/// Never commit real values for Secret.
/// </summary>
public class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Secret { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public int AccessTokenExpirationMinutes { get; set; } = 15;
    public int RefreshTokenExpirationDays { get; set; } = 30;
}
