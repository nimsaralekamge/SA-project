using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TalentFlow.API.Migrations
{
    /// <inheritdoc />
    public partial class AddCandidateEmail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CandidateEmail",
                table: "Interviews",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CandidateEmail",
                table: "Interviews");
        }
    }
}
