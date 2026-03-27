using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lenden.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class groupanduser_balancerelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_user_balances_groups_GroupId1",
                table: "user_balances");

            migrationBuilder.DropIndex(
                name: "IX_user_balances_GroupId1",
                table: "user_balances");

            migrationBuilder.DropColumn(
                name: "GroupId1",
                table: "user_balances");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AddColumn<long>(
                name: "GroupId1",
                table: "user_balances",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateIndex(
                name: "IX_user_balances_GroupId1",
                table: "user_balances",
                column: "GroupId1");

            migrationBuilder.AddForeignKey(
                name: "FK_user_balances_groups_GroupId1",
                table: "user_balances",
                column: "GroupId1",
                principalTable: "groups",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
