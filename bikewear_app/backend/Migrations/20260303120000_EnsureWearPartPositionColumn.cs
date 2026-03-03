using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <summary>
    /// Idempotent migration that ensures the Position column exists on
    /// Verschleissteile. Uses ADD COLUMN IF NOT EXISTS so it is safe to run
    /// even if the column was already added by AddWearPartPosition.
    /// </summary>
    public partial class EnsureWearPartPositionColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                "ALTER TABLE \"Verschleissteile\" ADD COLUMN IF NOT EXISTS \"Position\" text NULL;");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Down is intentionally a no-op: dropping the column is destructive
            // and AddWearPartPosition already contains the canonical Drop logic.
        }
    }
}
