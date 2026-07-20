using System;

namespace TalentFlow.API.DTOs
{
    // What the frontend sends when you click "Schedule Interview"
    public class CreateInterviewDto
    {
        public string CandidateName { get; set; } = string.Empty;
        public string CandidateRole { get; set; } = string.Empty;
        public string PipelineStage { get; set; } = string.Empty;
        public DateTime ScheduledTime { get; set; }
        public int DurationMinutes { get; set; }
    }

    // What the backend sends to populate the Upcoming/Completed tabs
    public class InterviewResponseDto
    {
        public int Id { get; set; }
        public string CandidateName { get; set; } = string.Empty;
        public string CandidateRole { get; set; } = string.Empty;
        public string PipelineStage { get; set; } = string.Empty;
        public DateTime ScheduledTime { get; set; }
        public int DurationMinutes { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}