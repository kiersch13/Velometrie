using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Benutzer",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    StravaId = table.Column<string>(type: "TEXT", nullable: false),
                    AccessToken = table.Column<string>(type: "TEXT", nullable: false),
                    RefreshToken = table.Column<string>(type: "TEXT", nullable: true),
                    TokenExpiresAt = table.Column<long>(type: "INTEGER", nullable: true),
                    Vorname = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Benutzer", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Rads",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Kategorie = table.Column<int>(type: "INTEGER", nullable: false),
                    Kilometerstand = table.Column<int>(type: "INTEGER", nullable: false),
                    StravaId = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rads", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Verschleissteile",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    RadId = table.Column<int>(type: "INTEGER", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Kategorie = table.Column<int>(type: "INTEGER", nullable: false),
                    EinbauKilometerstand = table.Column<int>(type: "INTEGER", nullable: false),
                    AusbauKilometerstand = table.Column<int>(type: "INTEGER", nullable: true),
                    EinbauDatum = table.Column<DateTime>(type: "TEXT", nullable: false),
                    AusbauDatum = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Verschleissteile", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Verschleissteile_Rads_RadId",
                        column: x => x.RadId,
                        principalTable: "Rads",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Verschleissteile_RadId",
                table: "Verschleissteile",
                column: "RadId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Benutzer");

            migrationBuilder.DropTable(
                name: "Verschleissteile");

            migrationBuilder.DropTable(
                name: "Rads");
        }
    }
}
