using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lenden.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "groups",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    slug = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    name = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    image_url = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    created_by = table.Column<long>(type: "bigint", nullable: false),
                    created_at = table.Column<DateTimeOffset>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "datetime(6)", nullable: false),
                    status = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_groups", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    slug = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    email = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    password_hash = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    username = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    given_name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    family_name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    role = table.Column<int>(type: "int", nullable: false),
                    email_verified = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    status = table.Column<int>(type: "int", nullable: false),
                    created_at = table.Column<DateTimeOffset>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AuthProviderEntity",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<long>(type: "bigint", nullable: false),
                    Provider = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ProviderUserId = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LinkedAt = table.Column<DateTimeOffset>(type: "datetime(6)", nullable: false),
                    user_id = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuthProviderEntity", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AuthProviderEntity_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AuthSessions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    UserId = table.Column<long>(type: "bigint", nullable: false),
                    RefreshTokenHash = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DeviceInfo = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IpAddress = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ExpiresAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    RevokedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    user_id = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuthSessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AuthSessions_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "expenses",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    public_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    group_id = table.Column<long>(type: "bigint", nullable: false),
                    creator_id = table.Column<long>(type: "bigint", nullable: false),
                    total_amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    category = table.Column<int>(type: "int", nullable: false),
                    description = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    image_url = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    created_at = table.Column<DateTimeOffset>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_expenses", x => x.id);
                    table.ForeignKey(
                        name: "FK_expenses_groups_group_id",
                        column: x => x.group_id,
                        principalTable: "groups",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_expenses_users_creator_id",
                        column: x => x.creator_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "friendships",
                columns: table => new
                {
                    requester_id = table.Column<long>(type: "bigint", nullable: false),
                    recipient_id = table.Column<long>(type: "bigint", nullable: false),
                    status = table.Column<int>(type: "int", nullable: false),
                    created_at = table.Column<DateTimeOffset>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_friendships", x => new { x.requester_id, x.recipient_id });
                    table.ForeignKey(
                        name: "FK_friendships_users_recipient_id",
                        column: x => x.recipient_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_friendships_users_requester_id",
                        column: x => x.requester_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "user_balances",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    group_id = table.Column<long>(type: "bigint", nullable: false),
                    GroupId1 = table.Column<long>(type: "bigint", nullable: false),
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    balance = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_balances", x => x.id);
                    table.ForeignKey(
                        name: "FK_user_balances_groups_GroupId1",
                        column: x => x.GroupId1,
                        principalTable: "groups",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_user_balances_groups_group_id",
                        column: x => x.group_id,
                        principalTable: "groups",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_user_balances_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "user_groups",
                columns: table => new
                {
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    group_id = table.Column<long>(type: "bigint", nullable: false),
                    role = table.Column<int>(type: "int", nullable: false),
                    status = table.Column<int>(type: "int", nullable: false),
                    joined_at = table.Column<DateTimeOffset>(type: "datetime(6)", nullable: false),
                    left_at = table.Column<DateTimeOffset>(type: "datetime(6)", nullable: true),
                    invited_by_user_id = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_groups", x => new { x.user_id, x.group_id });
                    table.ForeignKey(
                        name: "FK_user_groups_groups_group_id",
                        column: x => x.group_id,
                        principalTable: "groups",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_user_groups_users_invited_by_user_id",
                        column: x => x.invited_by_user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_user_groups_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "user_infos",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    phone_number = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    address = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    image_url = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    date_of_birth = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_infos", x => x.id);
                    table.ForeignKey(
                        name: "FK_user_infos_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "user_expenses",
                columns: table => new
                {
                    expense_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    net = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    paid = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    split = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_expenses", x => new { x.expense_id, x.user_id });
                    table.ForeignKey(
                        name: "FK_user_expenses_expenses_expense_id",
                        column: x => x.expense_id,
                        principalTable: "expenses",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_user_expenses_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_AuthProviderEntity_user_id",
                table: "AuthProviderEntity",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_AuthSessions_user_id",
                table: "AuthSessions",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_expenses_creator_id",
                table: "expenses",
                column: "creator_id");

            migrationBuilder.CreateIndex(
                name: "IX_expenses_group_id",
                table: "expenses",
                column: "group_id");

            migrationBuilder.CreateIndex(
                name: "IX_expenses_public_id",
                table: "expenses",
                column: "public_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_friendships_recipient_id",
                table: "friendships",
                column: "recipient_id");

            migrationBuilder.CreateIndex(
                name: "IX_friendships_requester_id_recipient_id",
                table: "friendships",
                columns: new[] { "requester_id", "recipient_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_groups_name",
                table: "groups",
                column: "name");

            migrationBuilder.CreateIndex(
                name: "IX_groups_slug",
                table: "groups",
                column: "slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_user_balances_group_id_user_id",
                table: "user_balances",
                columns: new[] { "group_id", "user_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_user_balances_GroupId1",
                table: "user_balances",
                column: "GroupId1");

            migrationBuilder.CreateIndex(
                name: "IX_user_balances_user_id",
                table: "user_balances",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_user_expenses_expense_id_user_id",
                table: "user_expenses",
                columns: new[] { "expense_id", "user_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_user_expenses_user_id",
                table: "user_expenses",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_user_groups_group_id_status",
                table: "user_groups",
                columns: new[] { "group_id", "status" });

            migrationBuilder.CreateIndex(
                name: "IX_user_groups_invited_by_user_id",
                table: "user_groups",
                column: "invited_by_user_id");

            migrationBuilder.CreateIndex(
                name: "IX_user_infos_user_id",
                table: "user_infos",
                column: "user_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_users_email",
                table: "users",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_users_slug",
                table: "users",
                column: "slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_users_username",
                table: "users",
                column: "username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuthProviderEntity");

            migrationBuilder.DropTable(
                name: "AuthSessions");

            migrationBuilder.DropTable(
                name: "friendships");

            migrationBuilder.DropTable(
                name: "user_balances");

            migrationBuilder.DropTable(
                name: "user_expenses");

            migrationBuilder.DropTable(
                name: "user_groups");

            migrationBuilder.DropTable(
                name: "user_infos");

            migrationBuilder.DropTable(
                name: "expenses");

            migrationBuilder.DropTable(
                name: "groups");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
