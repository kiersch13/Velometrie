using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddIndoorAndBikeFitFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // ── Bike: Indoor-Kilometerstand ────────────────────────────────
            migrationBuilder.AddColumn<int>(
                name: "IndoorKilometerstand",
                table: "Rads",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            // ── Bike: Bike-Fit Felder ──────────────────────────────────────
            migrationBuilder.AddColumn<double>(
                name: "Sattelhoehe",
                table: "Rads",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Sattelversatz",
                table: "Rads",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Vorbaulaenge",
                table: "Rads",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Vorbauwinkel",
                table: "Rads",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Kurbellaenge",
                table: "Rads",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Lenkerbreite",
                table: "Rads",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Spacer",
                table: "Rads",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Reach",
                table: "Rads",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Stack",
                table: "Rads",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Radstand",
                table: "Rads",
                type: "integer",
                nullable: true);

            // ── WearPart: Indoor-Felder ────────────────────────────────────
            migrationBuilder.AddColumn<bool>(
                name: "IndoorIgnorieren",
                table: "Verschleissteile",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "EinbauIndoorKilometerstand",
                table: "Verschleissteile",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AusbauIndoorKilometerstand",
                table: "Verschleissteile",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IndoorKilometerstand",
                table: "Rads");

            migrationBuilder.DropColumn(
                name: "Sattelhoehe",
                table: "Rads");

            migrationBuilder.DropColumn(
                name: "Sattelversatz",
                table: "Rads");

            migrationBuilder.DropColumn(
                name: "Vorbaulaenge",
                table: "Rads");

            migrationBuilder.DropColumn(
                name: "Vorbauwinkel",
                table: "Rads");

            migrationBuilder.DropColumn(
                name: "Kurbellaenge",
                table: "Rads");

            migrationBuilder.DropColumn(
                name: "Lenkerbreite",
                table: "Rads");

            migrationBuilder.DropColumn(
                name: "Spacer",
                table: "Rads");

            migrationBuilder.DropColumn(
                name: "Reach",
                table: "Rads");

            migrationBuilder.DropColumn(
                name: "Stack",
                table: "Rads");

            migrationBuilder.DropColumn(
                name: "Radstand",
                table: "Rads");

            migrationBuilder.DropColumn(
                name: "IndoorIgnorieren",
                table: "Verschleissteile");

            migrationBuilder.DropColumn(
                name: "EinbauIndoorKilometerstand",
                table: "Verschleissteile");

            migrationBuilder.DropColumn(
                name: "AusbauIndoorKilometerstand",
                table: "Verschleissteile");
        }
    }
}
