using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lenden.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class removedGroupEntity1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_user_balances_groups_GroupEntityId",
                table: "user_balances");

            migrationBuilder.DropIndex(
                name: "IX_user_balances_GroupEntityId",
                table: "user_balances");

            migrationBuilder.DropColumn(
                name: "GroupEntityId",
                table: "user_balances");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "GroupEntityId",
                table: "user_balances",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_user_balances_GroupEntityId",
                table: "user_balances",
                column: "GroupEntityId");

            migrationBuilder.AddForeignKey(
                name: "FK_user_balances_groups_GroupEntityId",
                table: "user_balances",
                column: "GroupEntityId",
                principalTable: "groups",
                principalColumn: "id");
        }
    }
}
