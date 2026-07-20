using System;

namespace TalentFlow.API.Models
{
    public class Interview
    {
        public int Id { get; set; }
        public string CandidateName { get; set; } = string.Empty;
        public string CandidateEmail { get; set; } = string.Empty; // <-- Added this
        public string CandidateRole { get; set; } = string.Empty;
        public string PipelineStage { get; set; } = string.Empty;
        public DateTime ScheduledTime { get; set; }
        public int DurationMinutes { get; set; }
        public string Status { get; set; } = "Upcoming";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
