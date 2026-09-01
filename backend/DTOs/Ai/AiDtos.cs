namespace FurnitureShop.Api.DTOs.Ai;

public record AiChatRequest(string Message, Guid? ConversationId);

public class AiChatResponseDto
{
    public Guid ConversationId { get; set; }
    public string Reply { get; set; } = string.Empty;
    public List<Guid>? SuggestedProductIds { get; set; }
}

public record AiRecommendationRequest(Guid? ProductId, string? RoomType, string? StylePreference);

public class AiRecommendationResponseDto
{
    public List<Guid> ProductIds { get; set; } = new();
    public string Rationale { get; set; } = string.Empty;
}

public record DescribeImageRequest(string ImageUrl);

public class DescribeImageResponseDto
{
    public string Description { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
}
