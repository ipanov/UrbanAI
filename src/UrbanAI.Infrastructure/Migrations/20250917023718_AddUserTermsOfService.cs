using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UrbanAI.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUserTermsOfService : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "RegistrationCompleted",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "OnboardingStep",
                table: "Users",
                type: "nvarchar(50)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "UserTermsOfService",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Version = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    AcceptedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IpAddress = table.Column<string>(type: "nvarchar(45)", maxLength: 45, nullable: true),
                    UserAgent = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTermsOfService", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserTermsOfService_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserTermsOfService_UserId",
                table: "UserTermsOfService",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserTermsOfService");

            migrationBuilder.DropColumn(
                name: "OnboardingStep",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "RegistrationCompleted",
                table: "Users");
        }
    }
}
