using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddWearPartReifenFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ReifenBreiteMm",
                table: "Verschleissteile",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "ReifenBreiteZoll",
                table: "Verschleissteile",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "ReifenDruckBar",
                table: "Verschleissteile",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "ReifenDruckPsi",
                table: "Verschleissteile",
                type: "double precision",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReifenBreiteMm",
                table: "Verschleissteile");

            migrationBuilder.DropColumn(
                name: "ReifenBreiteZoll",
                table: "Verschleissteile");

            migrationBuilder.DropColumn(
                name: "ReifenDruckBar",
                table: "Verschleissteile");

            migrationBuilder.DropColumn(
                name: "ReifenDruckPsi",
                table: "Verschleissteile");
        }
    }
}
