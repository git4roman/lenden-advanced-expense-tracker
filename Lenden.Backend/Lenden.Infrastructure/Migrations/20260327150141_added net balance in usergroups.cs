using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lenden.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class addednetbalanceinusergroups : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "net_balance",
                table: "user_groups",
                type: "decimal(65,30)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "net_balance",
                table: "user_groups");
        }
    }
}
