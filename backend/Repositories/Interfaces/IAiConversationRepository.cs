using FurnitureShop.Api.Entities;

namespace FurnitureShop.Api.Repositories.Interfaces;

public interface IAiConversationRepository : IRepository<AiConversation>
{
    Task<AiConversation?> GetWithMessagesAsync(Guid conversationId, CancellationToken ct = default);
}
