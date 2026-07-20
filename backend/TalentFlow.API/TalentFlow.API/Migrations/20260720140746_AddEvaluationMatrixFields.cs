using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TalentFlow.API.Migrations
{
    /// <inheritdoc />
    public partial class AddEvaluationMatrixFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PasswordResetToken",
                table: "Users",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ResetTokenExpires",
                table: "Users",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CandidateId",
                table: "Evaluations",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CommunicationScore",
                table: "Evaluations",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Evaluations",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CultureAlignmentScore",
                table: "Evaluations",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ExecutiveSummary",
                table: "Evaluations",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "OverallMatchScore",
                table: "Evaluations",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SystemDesignScore",
                table: "Evaluations",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TechnicalDepthScore",
                table: "Evaluations",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PasswordResetToken",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ResetTokenExpires",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CandidateId",
                table: "Evaluations");

            migrationBuilder.DropColumn(
                name: "CommunicationScore",
                table: "Evaluations");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Evaluations");

            migrationBuilder.DropColumn(
                name: "CultureAlignmentScore",
                table: "Evaluations");

            migrationBuilder.DropColumn(
                name: "ExecutiveSummary",
                table: "Evaluations");

            migrationBuilder.DropColumn(
                name: "OverallMatchScore",
                table: "Evaluations");

            migrationBuilder.DropColumn(
                name: "SystemDesignScore",
                table: "Evaluations");

            migrationBuilder.DropColumn(
                name: "TechnicalDepthScore",
                table: "Evaluations");
        }
    }
}
