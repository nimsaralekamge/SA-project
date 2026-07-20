namespace TalentFlow.API.DTOs
{
    public class CreateEvaluationDto
    {
        public int CandidateId { get; set; }
        public int TechnicalDepthScore { get; set; }
        public int SystemDesignScore { get; set; }
        public int CommunicationScore { get; set; }
        public int CultureAlignmentScore { get; set; }
        public string ExecutiveSummary { get; set; } = string.Empty;
    }
}