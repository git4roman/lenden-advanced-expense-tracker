using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lenden.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RenamedKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_expense_repayments_expenses_ExpenseId",
                table: "expense_repayments");

            migrationBuilder.RenameColumn(
                name: "Amount",
                table: "expense_repayments",
                newName: "amount");

            migrationBuilder.RenameColumn(
                name: "ExpenseId",
                table: "expense_repayments",
                newName: "expense_id");

            migrationBuilder.AddForeignKey(
                name: "FK_expense_repayments_expenses_expense_id",
                table: "expense_repayments",
                column: "expense_id",
                principalTable: "expenses",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_expense_repayments_expenses_expense_id",
                table: "expense_repayments");

            migrationBuilder.RenameColumn(
                name: "amount",
                table: "expense_repayments",
                newName: "Amount");

            migrationBuilder.RenameColumn(
                name: "expense_id",
                table: "expense_repayments",
                newName: "ExpenseId");

            migrationBuilder.AddForeignKey(
                name: "FK_expense_repayments_expenses_ExpenseId",
                table: "expense_repayments",
                column: "ExpenseId",
                principalTable: "expenses",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
