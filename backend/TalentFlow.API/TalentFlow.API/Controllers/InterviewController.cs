using Microsoft.AspNetCore.Mvc;
using TalentFlow.API.Data;
using TalentFlow.API.Models;
using Microsoft.EntityFrameworkCore;
using TalentFlow.API.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using System.Linq;

namespace TalentFlow.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InterviewController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly EmailService _emailService;

        public InterviewController(AppDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // GET: api/Interview
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Interview>>> GetInterviews()
        {
            return await _context.Interviews.ToListAsync();
        }

        // GET: api/Interview/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var today = DateTime.UtcNow.Date;

            int interviewsToday = await _context.Interviews
                .CountAsync(i => i.ScheduledTime.Date == today);

            int totalInterviews = await _context.Interviews.CountAsync();

            double avgMatch = await _context.Evaluations.AnyAsync()
                ? await _context.Evaluations.AverageAsync(e => e.OverallMatchScore)
                : 82.0;

            return Ok(new
            {
                pendingEvaluations = totalInterviews,
                interviewsToday = interviewsToday,
                avgMatchScore = Math.Round(avgMatch, 0),
                conversionRate = 68
            });
        }

        // POST: api/Interview
        [HttpPost]
        public async Task<ActionResult<Interview>> PostInterview(Interview interview)
        {
            // 1. Save the interview to the PostgreSQL database
            _context.Interviews.Add(interview);
            await _context.SaveChangesAsync();

            // 2. Trigger the dynamic email notification to the candidate's actual typed email
            await _emailService.SendInterviewScheduledEmailAsync(
                interview.CandidateEmail,
                interview.CandidateName,
                interview.CandidateRole,
                interview.PipelineStage,
                interview.ScheduledTime,
                interview.DurationMinutes
            );

            // 3. Return the success response to Swagger/Frontend
            return CreatedAtAction(nameof(GetInterviews), new { id = interview.Id }, interview);
        }
    }
}