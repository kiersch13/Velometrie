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
            // 'timestamp with time zone' → 'timestamp without time zone' is an explicit
            // (not implicit) cast in PostgreSQL, so a USING clause is required.
            // AT TIME ZONE 'UTC' treats the stored UTC instant as a local unspecified
            // timestamp, which is the correct semantic for wall-clock dates in this app.
            migrationBuilder.Sql(
                """
                ALTER TABLE "Verschleissteile"
                    ALTER COLUMN "EinbauDatum"
                        TYPE timestamp without time zone
                        USING "EinbauDatum" AT TIME ZONE 'UTC',
                    ALTER COLUMN "AusbauDatum"
                        TYPE timestamp without time zone
                        USING "AusbauDatum" AT TIME ZONE 'UTC';
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                ALTER TABLE "Verschleissteile"
                    ALTER COLUMN "EinbauDatum"
                        TYPE timestamp with time zone
                        USING "EinbauDatum" AT TIME ZONE 'UTC',
                    ALTER COLUMN "AusbauDatum"
                        TYPE timestamp with time zone
                        USING "AusbauDatum" AT TIME ZONE 'UTC';
                """);
        }
    }
}
