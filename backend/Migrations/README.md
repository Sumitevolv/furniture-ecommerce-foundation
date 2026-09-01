# Migrations

## Current status

`20260831090122_InitialCreate.cs` is a **hand-authored** migration that
creates the full schema for every entity in `Entities/` — 15 tables, all
foreign keys, unique indexes, and Postgres column types, cross-checked
against the fluent configuration in `Data/AppDbContext.cs`.

It was written by hand because this environment could not reach
`api.nuget.org` to run the real `dotnet ef migrations add` tool. The
`Up()`/`Down()` methods (the actual schema-creation logic) were reviewed
carefully against the entity model and should be correct, but they have
**not been compiled or applied to a real database**, so treat this as a
strong first draft rather than a verified artifact.

The two companion files —
`20260831090122_InitialCreate.Designer.cs` and
`AppDbContextModelSnapshot.cs` — are **intentionally minimal stubs**, not
fabricated full model snapshots. Each has a comment explaining why. In
short: EF's own generated snapshot format is dense, precise, tooling-owned
metadata, and hand-faking it convincingly risked producing something that
*looked* legitimate but silently drifted from the real model — worse than
an honest gap.

## What works as-is

`dotnet ef database update` / `context.Database.Migrate()` only need the
`Up()`/`Down()` methods plus the `[DbContext]`/`[Migration]` attributes for
discovery — both are present and correct. So this migration should apply
cleanly to a fresh Postgres database.

## What to do before adding a second migration

Regenerate everything properly from a machine with NuGet access:

```bash
cd backend
dotnet restore
dotnet tool install --global dotnet-ef   # one-time
dotnet ef migrations remove              # removes this hand-authored one
dotnet ef migrations add InitialCreate --output-dir Migrations
dotnet ef database update
```

This replaces the stub Designer/Snapshot files with real, tool-verified
ones and gives you a trustworthy baseline for all future migrations.
