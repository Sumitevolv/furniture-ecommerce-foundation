using FurnitureShop.Api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

#nullable disable

namespace FurnitureShop.Api.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        // -------------------------------------------------------------------
        // Same caveat as InitialCreate.Designer.cs: this is a deliberately
        // minimal stub, not a hand-fabricated full model snapshot. Applying
        // the InitialCreate migration does not depend on this file being
        // complete. Before generating any *additional* migration, replace
        // this file by running (from a machine with NuGet access):
        //   dotnet ef migrations remove
        //   dotnet ef migrations add InitialCreate --output-dir Migrations
        // which regenerates a tool-verified snapshot alongside the migration.
        // -------------------------------------------------------------------
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
            // Intentionally minimal — see caveat above.
        }
    }
}
