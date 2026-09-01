using FurnitureShop.Api.DTOs.Cart;
using FurnitureShop.Api.DTOs.Products;
using FurnitureShop.Api.Entities;
using FurnitureShop.Api.Middleware;
using FurnitureShop.Api.Repositories.Interfaces;
using FurnitureShop.Api.Services.Interfaces;

namespace FurnitureShop.Api.Services;

public class CartService : ICartService
{
    private const decimal TaxRate = 0.05m; // 5% — configurable per-region in a future iteration
    private const decimal FlatShipping = 0m; // free shipping by default; hook up rules later

    private readonly ICartRepository _cartRepository;
    private readonly IProductRepository _productRepository;

    public CartService(ICartRepository cartRepository, IProductRepository productRepository)
    {
        _cartRepository = cartRepository;
        _productRepository = productRepository;
    }

    public async Task<CartDto> GetOrCreateAsync(Guid userId, CancellationToken ct = default)
    {
        var cart = await _cartRepository.GetByUserIdAsync(userId, ct);

        if (cart == null)
        {
            cart = new Cart { UserId = userId };
            await _cartRepository.AddAsync(cart, ct);
            await _cartRepository.SaveChangesAsync(ct);
        }

        return ToDto(cart);
    }

    public async Task<CartDto> AddItemAsync(Guid userId, AddCartItemRequest request, CancellationToken ct = default)
    {
        var product = await _productRepository.GetByIdWithDetailsAsync(request.ProductId, ct)
            ?? throw new NotFoundException("Product not found.");

        if (product.Availability == ProductAvailability.OutOfStock)
        {
            throw new AppException("This product is currently out of stock.");
        }

        var cart = await _cartRepository.GetByUserIdAsync(userId, ct);
        if (cart == null)
        {
            cart = new Cart { UserId = userId };
            await _cartRepository.AddAsync(cart, ct);
            await _cartRepository.SaveChangesAsync(ct);
        }

        var variant = request.VariantId.HasValue
            ? product.Variants.FirstOrDefault(v => v.Id == request.VariantId.Value)
            : null;

        var unitPrice = variant?.PriceOverride ?? product.Price;

        var existingItem = cart.Items.FirstOrDefault(i => i.ProductId == request.ProductId && i.VariantId == request.VariantId);
        if (existingItem != null)
        {
            existingItem.Quantity += request.Quantity;
        }
        else
        {
            cart.Items.Add(new CartItem
            {
                CartId = cart.Id,
                ProductId = request.ProductId,
                VariantId = request.VariantId,
                Quantity = request.Quantity,
                UnitPrice = unitPrice,
            });
        }

        await _cartRepository.SaveChangesAsync(ct);

        var refreshed = await _cartRepository.GetWithItemsAsync(cart.Id, ct) ?? cart;
        return ToDto(refreshed);
    }

    public async Task<CartDto> UpdateItemAsync(Guid userId, Guid itemId, int quantity, CancellationToken ct = default)
    {
        if (quantity < 1)
        {
            throw new AppException("Quantity must be at least 1.");
        }

        var cart = await _cartRepository.GetByUserIdAsync(userId, ct)
            ?? throw new NotFoundException("Cart not found.");

        var item = cart.Items.FirstOrDefault(i => i.Id == itemId)
            ?? throw new NotFoundException("Cart item not found.");

        item.Quantity = quantity;
        await _cartRepository.SaveChangesAsync(ct);

        return ToDto(cart);
    }

    public async Task<CartDto> RemoveItemAsync(Guid userId, Guid itemId, CancellationToken ct = default)
    {
        var cart = await _cartRepository.GetByUserIdAsync(userId, ct)
            ?? throw new NotFoundException("Cart not found.");

        var item = cart.Items.FirstOrDefault(i => i.Id == itemId)
            ?? throw new NotFoundException("Cart item not found.");

        cart.Items.Remove(item);
        await _cartRepository.SaveChangesAsync(ct);

        return ToDto(cart);
    }

    public async Task<CartDto> ClearAsync(Guid userId, CancellationToken ct = default)
    {
        var cart = await _cartRepository.GetByUserIdAsync(userId, ct)
            ?? throw new NotFoundException("Cart not found.");

        cart.Items.Clear();
        await _cartRepository.SaveChangesAsync(ct);

        return ToDto(cart);
    }

    private static CartDto ToDto(Cart cart)
    {
        var items = cart.Items.Select(i => new CartItemDto
        {
            Id = i.Id,
            Product = new ProductListItemDto
            {
                Id = i.Product.Id,
                Name = i.Product.Name,
                Slug = i.Product.Slug,
                Price = i.Product.Price,
                CompareAtPrice = i.Product.CompareAtPrice,
                Currency = i.Product.Currency,
                Images = i.Product.Images.OrderBy(img => img.SortOrder).Select(img => new ProductImageDto
                {
                    Id = img.Id,
                    Url = img.Url,
                    AltText = img.AltText,
                    IsPrimary = img.IsPrimary,
                    SortOrder = img.SortOrder,
                }).ToList(),
                Availability = i.Product.Availability.ToString().ToLowerInvariant(),
                Rating = i.Product.Rating,
                ReviewCount = i.Product.ReviewCount,
                IsFeatured = i.Product.IsFeatured,
                CategoryName = i.Product.Category?.Name ?? string.Empty,
            },
            VariantId = i.VariantId,
            VariantLabel = i.Variant?.Name,
            Quantity = i.Quantity,
            UnitPrice = i.UnitPrice,
        }).ToList();

        var subtotal = items.Sum(i => i.UnitPrice * i.Quantity);
        var tax = Math.Round(subtotal * TaxRate, 2);
        var shipping = subtotal > 0 ? FlatShipping : 0;

        return new CartDto
        {
            Id = cart.Id,
            Items = items,
            Subtotal = subtotal,
            EstimatedTax = tax,
            EstimatedShipping = shipping,
            Total = subtotal + tax + shipping,
            Currency = "INR",
        };
    }
}
