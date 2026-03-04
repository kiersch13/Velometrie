using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddFahrstundenAndServiceEintrag : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "AusbauFahrstunden",
                table: "Verschleissteile",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "EinbauFahrstunden",
                table: "Verschleissteile",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Fahrstunden",
                table: "Rads",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.CreateTable(
                name: "ServiceEintraege",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    WearPartId = table.Column<int>(type: "integer", nullable: false),
                    ServiceTyp = table.Column<int>(type: "integer", nullable: false),
                    Datum = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    BeiFahrstunden = table.Column<double>(type: "double precision", nullable: false),
                    Notizen = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceEintraege", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ServiceEintraege_Verschleissteile_WearPartId",
                        column: x => x.WearPartId,
                        principalTable: "Verschleissteile",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ServiceEintraege_WearPartId",
                table: "ServiceEintraege",
                column: "WearPartId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ServiceEintraege");

            migrationBuilder.DropColumn(
                name: "AusbauFahrstunden",
                table: "Verschleissteile");

            migrationBuilder.DropColumn(
                name: "EinbauFahrstunden",
                table: "Verschleissteile");

            migrationBuilder.DropColumn(
                name: "Fahrstunden",
                table: "Rads");
        }
    }
}
