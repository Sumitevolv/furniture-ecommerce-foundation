using System.Text.Json;
using FurnitureShop.Api.Configuration;
using Microsoft.Extensions.Options;
using OpenAI.Chat;

namespace FurnitureShop.Api.Integrations.OpenAi;

/// <summary>
/// All calls to the OpenAI API are made here, server-side only — the API
/// key never reaches the browser (see frontend/services/ai-service.ts,
/// which only calls our own /api/ai/* endpoints).
/// </summary>
public class OpenAiService : IOpenAiService
{
    private const string SystemPrompt =
        "You are a warm, knowledgeable furniture design assistant for a premium furniture store. " +
        "Help customers choose pieces based on their room, style, and needs. Keep replies concise " +
        "(2-4 sentences), specific, and grounded in real furniture/interior-design knowledge. " +
        "Never invent product names, prices, or stock claims that weren't given to you.";

    private readonly ChatClient? _chatClient;
    private readonly OpenAiOptions _options;
    private readonly ILogger<OpenAiService> _logger;

    public OpenAiService(IOptions<OpenAiOptions> options, ILogger<OpenAiService> logger)
    {
        _options = options.Value;
        _logger = logger;

        if (_options.Enabled && !string.IsNullOrWhiteSpace(_options.ApiKey))
        {
            _chatClient = new ChatClient(_options.ChatModel, _options.ApiKey);
        }
    }

    public async Task<string> GetChatReplyAsync(IEnumerable<ChatTurn> history, string userMessage, CancellationToken ct = default)
    {
        if (_chatClient == null)
        {
            _logger.LogWarning("OpenAI service called without a configured API key");
            return "The design assistant isn't configured yet. Please check back soon.";
        }

        var messages = new List<ChatMessage> { new SystemChatMessage(SystemPrompt) };
        foreach (var turn in history)
        {
            messages.Add(turn.Role == "user"
                ? new UserChatMessage(turn.Content)
                : new AssistantChatMessage(turn.Content));
        }
        messages.Add(new UserChatMessage(userMessage));

        var completionOptions = new ChatCompletionOptions { MaxOutputTokenCount = _options.MaxTokens };

        try
        {
            var completion = await _chatClient.CompleteChatAsync(messages, completionOptions, ct);
            return completion.Value.Content.Count > 0
                ? completion.Value.Content[0].Text
                : "Sorry, I couldn't come up with a reply just now.";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "OpenAI chat completion failed");
            return "Sorry, the design assistant is temporarily unavailable. Please try again shortly.";
        }
    }

    public async Task<(string Description, List<string> Tags)> DescribeProductImageAsync(string imageUrl, CancellationToken ct = default)
    {
        if (_chatClient == null)
        {
            return ("The design assistant isn't configured yet.", new List<string>());
        }

        var prompt =
            "Describe this furniture item in one sentence, then list 3-5 lowercase style/material tags. " +
            "Respond as strict JSON: {\"description\": string, \"tags\": string[]}.";

        var messages = new List<ChatMessage>
        {
            new SystemChatMessage(SystemPrompt),
            new UserChatMessage(
                ChatMessageContentPart.CreateTextPart(prompt),
                ChatMessageContentPart.CreateImagePart(new Uri(imageUrl))),
        };

        try
        {
            var completion = await _chatClient.CompleteChatAsync(messages, cancellationToken: ct);
            var raw = completion.Value.Content.Count > 0 ? completion.Value.Content[0].Text : "{}";

            var parsed = JsonSerializer.Deserialize<DescribeImageResult>(raw, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            });

            return (parsed?.Description ?? "", parsed?.Tags ?? new List<string>());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "OpenAI image description failed");
            return ("Unable to generate a description right now.", new List<string>());
        }
    }

    private class DescribeImageResult
    {
        public string Description { get; set; } = string.Empty;
        public List<string> Tags { get; set; } = new();
    }
}
