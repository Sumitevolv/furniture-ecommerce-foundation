namespace FurnitureShop.Api.Entities;

public class Cart : BaseEntity
{
    public Guid? UserId { get; set; }
    public User? User { get; set; }

    /// <summary>Anonymous/guest carts are tracked by a client-issued session id.</summary>
    public string? SessionId { get; set; }

    public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
}

public class CartItem : BaseEntity
{
    public Guid CartId { get; set; }
    public Cart Cart { get; set; } = null!;

    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public Guid? VariantId { get; set; }
    public ProductVariant? Variant { get; set; }

    public int Quantity { get; set; }

    /// <summary>Price snapshot at time of add, so later price changes don't silently alter the cart.</summary>
    public decimal UnitPrice { get; set; }
}
