using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TalentFlow.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateInterviewSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CandidateName",
                table: "Interviews",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CandidateRole",
                table: "Interviews",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Interviews",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "DurationMinutes",
                table: "Interviews",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "PipelineStage",
                table: "Interviews",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "ScheduledTime",
                table: "Interviews",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Interviews",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CandidateName",
                table: "Interviews");

            migrationBuilder.DropColumn(
                name: "CandidateRole",
                table: "Interviews");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Interviews");

            migrationBuilder.DropColumn(
                name: "DurationMinutes",
                table: "Interviews");

            migrationBuilder.DropColumn(
                name: "PipelineStage",
                table: "Interviews");

            migrationBuilder.DropColumn(
                name: "ScheduledTime",
                table: "Interviews");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Interviews");
        }
    }
}
