using System.Text.Json;
using FurnitureShop.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace FurnitureShop.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Address> Addresses => Set<Address>();

    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();
    public DbSet<ProductVariant> ProductVariants => Set<ProductVariant>();
    public DbSet<ProductReview> ProductReviews => Set<ProductReview>();

    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();

    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Payment> Payments => Set<Payment>();

    public DbSet<AiConversation> AiConversations => Set<AiConversation>();
    public DbSet<AiMessage> AiMessages => Set<AiMessage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ---------- User ----------
        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.Email).HasMaxLength(256).IsRequired();
            e.Property(u => u.FirstName).HasMaxLength(100).IsRequired();
            e.Property(u => u.LastName).HasMaxLength(100).IsRequired();
        });

        modelBuilder.Entity<RefreshToken>(e =>
        {
            e.HasIndex(t => t.TokenHash).IsUnique();
            e.HasOne(t => t.User)
                .WithMany(u => u.RefreshTokens)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Address>(e =>
        {
            e.HasOne(a => a.User)
                .WithMany(u => u.Addresses)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ---------- Catalog ----------
        modelBuilder.Entity<Category>(e =>
        {
            e.HasIndex(c => c.Slug).IsUnique();
            e.HasOne(c => c.Parent)
                .WithMany(c => c.Children)
                .HasForeignKey(c => c.ParentId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Product>(e =>
        {
            e.HasIndex(p => p.Slug).IsUnique();
            e.Property(p => p.Price).HasColumnType("numeric(12,2)");
            e.Property(p => p.CompareAtPrice).HasColumnType("numeric(12,2)");
            e.Property(p => p.Rating).HasColumnType("numeric(3,2)");
            e.HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<ProductImage>(e =>
        {
            e.HasOne(i => i.Product)
                .WithMany(p => p.Images)
                .HasForeignKey(i => i.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ProductVariant>(e =>
        {
            e.HasIndex(v => v.Sku).IsUnique();
            e.Property(v => v.PriceOverride).HasColumnType("numeric(12,2)");
            e.HasOne(v => v.Product)
                .WithMany(p => p.Variants)
                .HasForeignKey(v => v.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            // Store the attribute dictionary as JSON — keeps variants flexible
            // (color/size/finish/etc.) without a rigid attribute table.
            var jsonOptions = new JsonSerializerOptions();
            e.Property(v => v.Attributes).HasConversion(
                v => JsonSerializer.Serialize(v, jsonOptions),
                v => JsonSerializer.Deserialize<Dictionary<string, string>>(v, jsonOptions) ?? new());
        });

        modelBuilder.Entity<ProductReview>(e =>
        {
            e.HasOne(r => r.Product)
                .WithMany(p => p.Reviews)
                .HasForeignKey(r => r.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ---------- Cart ----------
        modelBuilder.Entity<Cart>(e =>
        {
            e.HasOne(c => c.User)
                .WithOne(u => u.Cart)
                .HasForeignKey<Cart>(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<CartItem>(e =>
        {
            e.Property(i => i.UnitPrice).HasColumnType("numeric(12,2)");
            e.HasOne(i => i.Cart)
                .WithMany(c => c.Items)
                .HasForeignKey(i => i.CartId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasOne(i => i.Product)
                .WithMany()
                .HasForeignKey(i => i.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ---------- Orders ----------
        modelBuilder.Entity<Order>(e =>
        {
            e.HasIndex(o => o.OrderNumber).IsUnique();
            e.Property(o => o.Subtotal).HasColumnType("numeric(12,2)");
            e.Property(o => o.Tax).HasColumnType("numeric(12,2)");
            e.Property(o => o.Shipping).HasColumnType("numeric(12,2)");
            e.Property(o => o.Total).HasColumnType("numeric(12,2)");
            e.HasOne(o => o.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<OrderItem>(e =>
        {
            e.Property(i => i.UnitPrice).HasColumnType("numeric(12,2)");
            e.Property(i => i.LineTotal).HasColumnType("numeric(12,2)");
            e.HasOne(i => i.Order)
                .WithMany(o => o.Items)
                .HasForeignKey(i => i.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Payment>(e =>
        {
            e.HasIndex(p => p.RazorpayOrderId).IsUnique();
            e.Property(p => p.Amount).HasColumnType("numeric(12,2)");
            e.HasOne(p => p.Order)
                .WithOne(o => o.Payment)
                .HasForeignKey<Payment>(p => p.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ---------- AI ----------
        modelBuilder.Entity<AiConversation>(e =>
        {
            e.HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<AiMessage>(e =>
        {
            e.HasOne(m => m.Conversation)
                .WithMany(c => c.Messages)
                .HasForeignKey(m => m.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    public override int SaveChanges()
    {
        TouchUpdatedAt();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        TouchUpdatedAt();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void TouchUpdatedAt()
    {
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = DateTime.UtcNow;
            }
        }
    }
}
