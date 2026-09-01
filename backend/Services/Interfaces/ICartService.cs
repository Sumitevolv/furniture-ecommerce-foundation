using FurnitureShop.Api.DTOs.Cart;

namespace FurnitureShop.Api.Services.Interfaces;

public interface ICartService
{
    Task<CartDto> GetOrCreateAsync(Guid userId, CancellationToken ct = default);
    Task<CartDto> AddItemAsync(Guid userId, AddCartItemRequest request, CancellationToken ct = default);
    Task<CartDto> UpdateItemAsync(Guid userId, Guid itemId, int quantity, CancellationToken ct = default);
    Task<CartDto> RemoveItemAsync(Guid userId, Guid itemId, CancellationToken ct = default);
    Task<CartDto> ClearAsync(Guid userId, CancellationToken ct = default);
}
