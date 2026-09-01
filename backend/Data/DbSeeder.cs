using FurnitureShop.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace FurnitureShop.Api.Data;

/// <summary>
/// Idempotent seed data for local development. Never run automatically in
/// Production (guarded in Program.cs by environment check).
/// </summary>
public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        await context.Database.MigrateAsync();

        if (!await context.Categories.AnyAsync())
        {
            var categories = new[]
            {
                new Category { Name = "Living", Slug = "living" },
                new Category { Name = "Bedroom", Slug = "bedroom" },
                new Category { Name = "Dining", Slug = "dining" },
                new Category { Name = "Lighting", Slug = "lighting" },
            };
            context.Categories.AddRange(categories);
            await context.SaveChangesAsync();
        }

        if (!await context.Users.AnyAsync(u => u.Role == UserRole.Admin))
        {
            context.Users.Add(new User
            {
                Email = "admin@furnitureshop.local",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("ChangeMe123!"),
                FirstName = "Store",
                LastName = "Admin",
                Role = UserRole.Admin,
                EmailVerified = true,
            });
            await context.SaveChangesAsync();
        }
    }
}
