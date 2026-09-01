using FurnitureShop.Api.DTOs.Products;

namespace FurnitureShop.Api.DTOs.Cart;

public class CartItemDto
{
    public Guid Id { get; set; }
    public ProductListItemDto Product { get; set; } = null!;
    public Guid? VariantId { get; set; }
    public string? VariantLabel { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}

public class CartDto
{
    public Guid Id { get; set; }
    public List<CartItemDto> Items { get; set; } = new();
    public decimal Subtotal { get; set; }
    public decimal EstimatedTax { get; set; }
    public decimal EstimatedShipping { get; set; }
    public decimal Total { get; set; }
    public string Currency { get; set; } = "INR";
}

public record AddCartItemRequest(Guid ProductId, Guid? VariantId, int Quantity);

public record UpdateCartItemRequest(int Quantity);
