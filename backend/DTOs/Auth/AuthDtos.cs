namespace FurnitureShop.Api.DTOs.Auth;

public record LoginRequest(string Email, string Password);

public record RegisterRequest(string FirstName, string LastName, string Email, string Password);

public record RefreshTokenRequest(string RefreshToken);

public record ForgotPasswordRequest(string Email);

public record ResetPasswordRequest(string Token, string NewPassword);

public class UserDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public bool EmailVerified { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class AuthTokensDto
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}

public class AuthSessionDto
{
    public UserDto User { get; set; } = null!;
    public AuthTokensDto Tokens { get; set; } = null!;
}
