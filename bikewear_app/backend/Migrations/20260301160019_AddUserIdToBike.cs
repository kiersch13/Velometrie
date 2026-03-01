using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddUserIdToBike : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Rads",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Rads_UserId",
                table: "Rads",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Rads_Benutzer_UserId",
                table: "Rads",
                column: "UserId",
                principalTable: "Benutzer",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Rads_Benutzer_UserId",
                table: "Rads");

            migrationBuilder.DropIndex(
                name: "IX_Rads_UserId",
                table: "Rads");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Rads");
        }
    }
}
