using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class SetProductActiveDefaultTrue : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Change default for Active to true and backfill existing rows
            migrationBuilder.AlterColumn<bool>(
                name: "Active",
                table: "Products",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            // Backfill: mark existing products as active if they are not marked deleted
            migrationBuilder.Sql("UPDATE Products SET Active = 1 WHERE IsDeleted = 0;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Revert default to false
            migrationBuilder.AlterColumn<bool>(
                name: "Active",
                table: "Products",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);
        }
    }
}
