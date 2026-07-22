namespace TalentFlow.API.Models;

public class JobCreateDto
{
    public string Title { get; set; } = string.Empty;

    public string Department { get; set; } = string.Empty;

    public string Location { get; set; } = string.Empty;

    public string WorkMode { get; set; } = string.Empty;

    public string EmploymentType { get; set; } = string.Empty;

    public string ExperienceLevel { get; set; } = string.Empty;

    public decimal MinSalary { get; set; }

    public decimal MaxSalary { get; set; }

    public string Currency { get; set; } = "USD";

    public List<string> Skills { get; set; } = new();

    public string Description { get; set; } = string.Empty;

    public string Requirements { get; set; } = string.Empty;

    public DateTime? ClosingDate { get; set; }

    public string Status { get; set; } = "Draft";
}