using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{

    public partial class SetProductActiveDefaultTrue : Migration
    {

        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.AlterColumn<bool>(
                name: "Active",
                table: "Products",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.Sql("UPDATE Products SET Active = 1 WHERE IsDeleted = 0;");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

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
