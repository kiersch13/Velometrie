using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

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
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Email = table.Column<string>(type: "text", nullable: true),
                    PasswordHash = table.Column<string>(type: "text", nullable: true),
                    Anzeigename = table.Column<string>(type: "text", nullable: true),
                    StravaId = table.Column<string>(type: "text", nullable: true),
                    AccessToken = table.Column<string>(type: "text", nullable: true),
                    RefreshToken = table.Column<string>(type: "text", nullable: true),
                    TokenExpiresAt = table.Column<long>(type: "bigint", nullable: true),
                    Vorname = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Benutzer", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Teilvorlagen",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Hersteller = table.Column<string>(type: "text", nullable: false),
                    Kategorie = table.Column<int>(type: "integer", nullable: false),
                    Gruppe = table.Column<string>(type: "text", nullable: true),
                    Geschwindigkeiten = table.Column<int>(type: "integer", nullable: true),
                    FahrradKategorien = table.Column<string>(type: "text", nullable: false),
                    Beschreibung = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Teilvorlagen", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Rads",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Kategorie = table.Column<int>(type: "integer", nullable: false),
                    Kilometerstand = table.Column<int>(type: "integer", nullable: false),
                    StravaId = table.Column<string>(type: "text", nullable: true),
                    UserId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rads", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Rads_Benutzer_UserId",
                        column: x => x.UserId,
                        principalTable: "Benutzer",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Verschleissteile",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RadId = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Kategorie = table.Column<int>(type: "integer", nullable: false),
                    EinbauKilometerstand = table.Column<int>(type: "integer", nullable: false),
                    AusbauKilometerstand = table.Column<int>(type: "integer", nullable: true),
                    EinbauDatum = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AusbauDatum = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
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
                name: "IX_Benutzer_Email",
                table: "Benutzer",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Rads_UserId",
                table: "Rads",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Verschleissteile_RadId",
                table: "Verschleissteile",
                column: "RadId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Teilvorlagen");

            migrationBuilder.DropTable(
                name: "Verschleissteile");

            migrationBuilder.DropTable(
                name: "Rads");

            migrationBuilder.DropTable(
                name: "Benutzer");
        }
    }
}
