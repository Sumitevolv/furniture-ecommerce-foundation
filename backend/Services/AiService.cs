using FurnitureShop.Api.DTOs.Ai;
using FurnitureShop.Api.Entities;
using FurnitureShop.Api.Integrations.OpenAi;
using FurnitureShop.Api.Middleware;
using FurnitureShop.Api.Repositories.Interfaces;
using FurnitureShop.Api.Services.Interfaces;

namespace FurnitureShop.Api.Services;

public class AiService : IAiService
{
    private readonly IOpenAiService _openAiService;
    private readonly IAiConversationRepository _conversationRepository;
    private readonly IProductRepository _productRepository;

    public AiService(
        IOpenAiService openAiService,
        IAiConversationRepository conversationRepository,
        IProductRepository productRepository)
    {
        _openAiService = openAiService;
        _conversationRepository = conversationRepository;
        _productRepository = productRepository;
    }

    public async Task<AiChatResponseDto> ChatAsync(Guid? userId, AiChatRequest request, CancellationToken ct = default)
    {
        AiConversation? conversation = request.ConversationId.HasValue
            ? await _conversationRepository.GetWithMessagesAsync(request.ConversationId.Value, ct)
            : null;

        if (conversation == null)
        {
            conversation = new AiConversation { UserId = userId };
            await _conversationRepository.AddAsync(conversation, ct);
        }

        var history = conversation.Messages
            .OrderBy(m => m.CreatedAt)
            .Select(m => new ChatTurn(m.Role == AiMessageRole.User ? "user" : "assistant", m.Content));

        var reply = await _openAiService.GetChatReplyAsync(history, request.Message, ct);

        conversation.Messages.Add(new AiMessage { ConversationId = conversation.Id, Role = AiMessageRole.User, Content = request.Message });
        conversation.Messages.Add(new AiMessage { ConversationId = conversation.Id, Role = AiMessageRole.Assistant, Content = reply });

        await _conversationRepository.SaveChangesAsync(ct);

        return new AiChatResponseDto
        {
            ConversationId = conversation.Id,
            Reply = reply,
        };
    }

    public async Task<AiRecommendationResponseDto> GetRecommendationsAsync(AiRecommendationRequest request, CancellationToken ct = default)
    {
        // Foundation-phase heuristic: recommend other featured products in
        // the same category as a starting point. A future iteration can
        // route this through OpenAI with product catalog context / embeddings
        // for genuinely personalized suggestions.
        List<Product> candidates;

        if (request.ProductId.HasValue)
        {
            var product = await _productRepository.GetByIdWithDetailsAsync(request.ProductId.Value, ct)
                ?? throw new NotFoundException("Product not found.");

            candidates = (await _productRepository.FindAsync(
                p => p.CategoryId == product.CategoryId && p.Id != product.Id && p.IsActive, ct))
                .Take(4)
                .ToList();
        }
        else
        {
            candidates = await _productRepository.GetFeaturedAsync(4, ct);
        }

        return new AiRecommendationResponseDto
        {
            ProductIds = candidates.Select(p => p.Id).ToList(),
            Rationale = request.ProductId.HasValue
                ? "Picked from the same category to complement your selection."
                : "A few of our current favorites to get you started.",
        };
    }

    public async Task<DescribeImageResponseDto> DescribeImageAsync(DescribeImageRequest request, CancellationToken ct = default)
    {
        var (description, tags) = await _openAiService.DescribeProductImageAsync(request.ImageUrl, ct);

        return new DescribeImageResponseDto
        {
            Description = description,
            Tags = tags,
        };
    }
}
