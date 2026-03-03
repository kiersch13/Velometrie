using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <summary>
    /// Changes EinbauDatum and AusbauDatum on Verschleissteile from
    /// 'timestamp with time zone' to 'timestamp without time zone'.
    ///
    /// Npgsql 9+ requires DateTimeKind.Utc when writing to 'timestamp with time zone',
    /// but the app stores wall-clock dates (no timezone semantics). Switching to
    /// 'timestamp without time zone' lets plain DateTime work without conversion.
    /// </summary>
    public partial class FixWearPartTimestampColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                ALTER TABLE "Verschleissteile"
                    ALTER COLUMN "EinbauDatum"  TYPE timestamp without time zone,
                    ALTER COLUMN "AusbauDatum"  TYPE timestamp without time zone;
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                ALTER TABLE "Verschleissteile"
                    ALTER COLUMN "EinbauDatum"  TYPE timestamp with time zone,
                    ALTER COLUMN "AusbauDatum"  TYPE timestamp with time zone;
                """);
        }
    }
}
