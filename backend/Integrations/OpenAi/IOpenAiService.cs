namespace FurnitureShop.Api.Integrations.OpenAi;

public record ChatTurn(string Role, string Content);

public interface IOpenAiService
{
    /// <summary>Sends the conversation history plus the new user message and returns the assistant's reply.</summary>
    Task<string> GetChatReplyAsync(IEnumerable<ChatTurn> history, string userMessage, CancellationToken ct = default);

    /// <summary>Generates a short product description + tags from an image URL (vision-capable model).</summary>
    Task<(string Description, List<string> Tags)> DescribeProductImageAsync(string imageUrl, CancellationToken ct = default);
}
