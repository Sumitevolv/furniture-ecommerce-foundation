using FurnitureShop.Api.Authentication;
using FurnitureShop.Api.DTOs.Cart;
using FurnitureShop.Api.DTOs.Common;
using FurnitureShop.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FurnitureShop.Api.Controllers;

[ApiController]
[Route("api/cart")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;
    private readonly ICurrentUserService _currentUser;

    public CartController(ICartService cartService, ICurrentUserService currentUser)
    {
        _cartService = cartService;
        _currentUser = currentUser;
    }

    private Guid UserId => _currentUser.UserId!.Value;

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken ct)
    {
        var cart = await _cartService.GetOrCreateAsync(UserId, ct);
        return Ok(ApiResponse<CartDto>.Ok(cart));
    }

    [HttpPost("items")]
    public async Task<IActionResult> AddItem([FromBody] AddCartItemRequest request, CancellationToken ct)
    {
        var cart = await _cartService.AddItemAsync(UserId, request, ct);
        return Ok(ApiResponse<CartDto>.Ok(cart, "Added to cart."));
    }

    [HttpPatch("items/{itemId:guid}")]
    public async Task<IActionResult> UpdateItem(Guid itemId, [FromBody] UpdateCartItemRequest request, CancellationToken ct)
    {
        var cart = await _cartService.UpdateItemAsync(UserId, itemId, request.Quantity, ct);
        return Ok(ApiResponse<CartDto>.Ok(cart));
    }

    [HttpDelete("items/{itemId:guid}")]
    public async Task<IActionResult> RemoveItem(Guid itemId, CancellationToken ct)
    {
        var cart = await _cartService.RemoveItemAsync(UserId, itemId, ct);
        return Ok(ApiResponse<CartDto>.Ok(cart, "Removed from cart."));
    }

    [HttpDelete]
    public async Task<IActionResult> Clear(CancellationToken ct)
    {
        var cart = await _cartService.ClearAsync(UserId, ct);
        return Ok(ApiResponse<CartDto>.Ok(cart, "Cart cleared."));
    }
}
