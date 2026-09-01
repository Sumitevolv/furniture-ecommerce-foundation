namespace FurnitureShop.Api.Entities;

public enum AiMessageRole
{
    User = 0,
    Assistant = 1
}

/// <summary>
/// Persists AI design-assistant conversations so context can be reloaded
/// across sessions and so usage can be audited/rate-limited per user.
/// </summary>
public class AiConversation : BaseEntity
{
    public Guid? UserId { get; set; }
    public User? User { get; set; }

    public ICollection<AiMessage> Messages { get; set; } = new List<AiMessage>();
}

public class AiMessage : BaseEntity
{
    public Guid ConversationId { get; set; }
    public AiConversation Conversation { get; set; } = null!;

    public AiMessageRole Role { get; set; }
    public string Content { get; set; } = string.Empty;
}
