using FurnitureShop.Api.Data;
using FurnitureShop.Api.Entities;
using FurnitureShop.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FurnitureShop.Api.Repositories;

public class AiConversationRepository : Repository<AiConversation>, IAiConversationRepository
{
    public AiConversationRepository(AppDbContext context) : base(context) { }

    public Task<AiConversation?> GetWithMessagesAsync(Guid conversationId, CancellationToken ct = default) =>
        DbSet.Include(c => c.Messages.OrderBy(m => m.CreatedAt))
             .FirstOrDefaultAsync(c => c.Id == conversationId, ct);
}
