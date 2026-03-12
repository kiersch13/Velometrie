using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddBikePhotoFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "FotoAktualisiertAm",
                table: "Rads",
                type: "timestamp without time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FotoDateiname",
                table: "Rads",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "FotoGroesseBytes",
                table: "Rads",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FotoMimeType",
                table: "Rads",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FotoStorageKey",
                table: "Rads",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FotoAktualisiertAm",
                table: "Rads");

            migrationBuilder.DropColumn(
                name: "FotoDateiname",
                table: "Rads");

            migrationBuilder.DropColumn(
                name: "FotoGroesseBytes",
                table: "Rads");

            migrationBuilder.DropColumn(
                name: "FotoMimeType",
                table: "Rads");

            migrationBuilder.DropColumn(
                name: "FotoStorageKey",
                table: "Rads");
        }
    }
}
