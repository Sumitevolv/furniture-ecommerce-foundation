using FurnitureShop.Api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FurnitureShop.Api.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20260831090122_InitialCreate")]
    partial class InitialCreate
    {
        // -------------------------------------------------------------------
        // HONEST CAVEAT: BuildTargetModel() below is intentionally left as a
        // minimal stub rather than a hand-fabricated full model snapshot.
        //
        // A tool-generated Designer.cs normally contains a complete,
        // precisely-annotated copy of the EF model (every property's exact
        // Npgsql column type, value-generation strategy, index/FK metadata)
        // so `dotnet ef migrations add <Next>` can diff against it. Hand
        // authoring that faithfully — without the compiler/tooling to
        // verify it — risks silently wrong annotations that are worse than
        // an honest gap.
        //
        // What this DOES support: applying this migration via
        // `dotnet ef database update` or `context.Database.Migrate()`,
        // since that only needs the Up()/Down() methods in InitialCreate.cs
        // plus this file's [DbContext]/[Migration] attributes for discovery.
        //
        // What this DOESN'T support yet: EF's "pending model changes"
        // detection and diffing for a *second* migration. Before adding any
        // future migration, regenerate this properly with:
        //   dotnet ef migrations remove
        //   dotnet ef migrations add InitialCreate --output-dir Migrations
        // run from a machine with NuGet access, which will replace this
        // file (and add the real AppDbContextModelSnapshot.cs) with
        // tool-verified output.
        // -------------------------------------------------------------------
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            // Intentionally minimal — see caveat above.
        }
    }
}
