using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddTeilvorlagen : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Teilvorlagen",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Hersteller = table.Column<string>(type: "TEXT", nullable: false),
                    Kategorie = table.Column<int>(type: "INTEGER", nullable: false),
                    Gruppe = table.Column<string>(type: "TEXT", nullable: true),
                    Geschwindigkeiten = table.Column<int>(type: "INTEGER", nullable: true),
                    FahrradKategorien = table.Column<string>(type: "TEXT", nullable: false),
                    Beschreibung = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Teilvorlagen", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Teilvorlagen");
        }
    }
}
