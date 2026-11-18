using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddReportAssignments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ServiceProviders",
                columns: table => new
                {
                    ProviderId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FullName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Department = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceProviders", x => x.ProviderId);
                });

            migrationBuilder.CreateTable(
                name: "WorkTypes",
                columns: table => new
                {
                    WorkTypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    NameWorkTypes = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkTypes", x => x.WorkTypeId);
                    table.ForeignKey(
                        name: "FK_WorkTypes_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "CategoryId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ReportAssignments",
                columns: table => new
                {
                    AssignmentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReportId = table.Column<int>(type: "int", nullable: false),
                    ProviderId = table.Column<int>(type: "int", nullable: false),
                    ManagerId = table.Column<int>(type: "int", nullable: false),
                    AssignedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsCurrent = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReportAssignments", x => x.AssignmentId);
                    table.ForeignKey(
                        name: "FK_ReportAssignments_Reports_ReportId",
                        column: x => x.ReportId,
                        principalTable: "Reports",
                        principalColumn: "ReportId");
                    table.ForeignKey(
                        name: "FK_ReportAssignments_ServiceProviders_ProviderId",
                        column: x => x.ProviderId,
                        principalTable: "ServiceProviders",
                        principalColumn: "ProviderId");
                    table.ForeignKey(
                        name: "FK_ReportAssignments_Users_ManagerId",
                        column: x => x.ManagerId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "ProviderWorkTypes",
                columns: table => new
                {
                    ProviderWorkTypesId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProviderId = table.Column<int>(type: "int", nullable: false),
                    WorkTypeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProviderWorkTypes", x => x.ProviderWorkTypesId);
                    table.ForeignKey(
                        name: "FK_ProviderWorkTypes_ServiceProviders_ProviderId",
                        column: x => x.ProviderId,
                        principalTable: "ServiceProviders",
                        principalColumn: "ProviderId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProviderWorkTypes_WorkTypes_WorkTypeId",
                        column: x => x.WorkTypeId,
                        principalTable: "WorkTypes",
                        principalColumn: "WorkTypeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProviderWorkTypes_ProviderId_WorkTypeId",
                table: "ProviderWorkTypes",
                columns: new[] { "ProviderId", "WorkTypeId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProviderWorkTypes_WorkTypeId",
                table: "ProviderWorkTypes",
                column: "WorkTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ReportAssignments_ManagerId",
                table: "ReportAssignments",
                column: "ManagerId");

            migrationBuilder.CreateIndex(
                name: "IX_ReportAssignments_ProviderId",
                table: "ReportAssignments",
                column: "ProviderId");

            migrationBuilder.CreateIndex(
                name: "IX_ReportAssignments_ReportId",
                table: "ReportAssignments",
                column: "ReportId");

            migrationBuilder.CreateIndex(
                name: "IX_WorkTypes_CategoryId",
                table: "WorkTypes",
                column: "CategoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProviderWorkTypes");

            migrationBuilder.DropTable(
                name: "ReportAssignments");

            migrationBuilder.DropTable(
                name: "WorkTypes");

            migrationBuilder.DropTable(
                name: "ServiceProviders");
        }
    }
}
