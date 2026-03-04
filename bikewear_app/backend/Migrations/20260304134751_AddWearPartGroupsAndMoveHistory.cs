using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddWearPartGroupsAndMoveHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "GruppeId",
                table: "Verschleissteile",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "VorgaengerId",
                table: "Verschleissteile",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "WearPartGruppen",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    RadId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WearPartGruppen", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WearPartGruppen_Rads_RadId",
                        column: x => x.RadId,
                        principalTable: "Rads",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Verschleissteile_GruppeId",
                table: "Verschleissteile",
                column: "GruppeId");

            migrationBuilder.CreateIndex(
                name: "IX_Verschleissteile_VorgaengerId",
                table: "Verschleissteile",
                column: "VorgaengerId");

            migrationBuilder.CreateIndex(
                name: "IX_WearPartGruppen_RadId",
                table: "WearPartGruppen",
                column: "RadId");

            migrationBuilder.AddForeignKey(
                name: "FK_Verschleissteile_Verschleissteile_VorgaengerId",
                table: "Verschleissteile",
                column: "VorgaengerId",
                principalTable: "Verschleissteile",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Verschleissteile_WearPartGruppen_GruppeId",
                table: "Verschleissteile",
                column: "GruppeId",
                principalTable: "WearPartGruppen",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Verschleissteile_Verschleissteile_VorgaengerId",
                table: "Verschleissteile");

            migrationBuilder.DropForeignKey(
                name: "FK_Verschleissteile_WearPartGruppen_GruppeId",
                table: "Verschleissteile");

            migrationBuilder.DropTable(
                name: "WearPartGruppen");

            migrationBuilder.DropIndex(
                name: "IX_Verschleissteile_GruppeId",
                table: "Verschleissteile");

            migrationBuilder.DropIndex(
                name: "IX_Verschleissteile_VorgaengerId",
                table: "Verschleissteile");

            migrationBuilder.DropColumn(
                name: "GruppeId",
                table: "Verschleissteile");

            migrationBuilder.DropColumn(
                name: "VorgaengerId",
                table: "Verschleissteile");
        }
    }
}
