using System.Security.Claims;

namespace FurnitureShop.Api.Authentication;

public interface ICurrentUserService
{
    Guid? UserId { get; }
    string? Email { get; }
    bool IsAdmin { get; }
    bool IsAuthenticated { get; }
}

/// <summary>
/// Wraps HttpContext.User claim lookups so controllers/services don't
/// reach into HttpContext directly — keeps them testable.
/// </summary>
public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    private ClaimsPrincipal? User => _httpContextAccessor.HttpContext?.User;

    public bool IsAuthenticated => User?.Identity?.IsAuthenticated ?? false;

    public Guid? UserId
    {
        get
        {
            var value = User?.FindFirstValue(ClaimTypes.NameIdentifier)
                        ?? User?.FindFirstValue("sub");
            return Guid.TryParse(value, out var id) ? id : null;
        }
    }

    public string? Email => User?.FindFirstValue(ClaimTypes.Email);

    public bool IsAdmin => User?.IsInRole("Admin") ?? false;
}
