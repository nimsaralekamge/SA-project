using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TalentFlow.API.Data;
using TalentFlow.API.Models;

namespace TalentFlow.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public JobsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/jobs
        [HttpGet]
        public async Task<IActionResult> GetJobs()
        {
            var jobs = await _context.Jobs
                .OrderByDescending(j => j.PostedAt)
                .ToListAsync();

            return Ok(jobs);
        }

        // GET: api/jobs/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetJob(int id)
        {
            var job = await _context.Jobs.FindAsync(id);

            if (job == null)
                return NotFound(new { message = "Job not found" });

            return Ok(job);
        }

        // POST: api/jobs
        [HttpPost]
        public async Task<IActionResult> CreateJob([FromBody] Job job)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            job.PostedAt = DateTime.UtcNow;
            job.ApplicantCount = 0;

            _context.Jobs.Add(job);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetJob),
                new { id = job.Id },
                job);
        }

        // PUT: api/jobs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateJob(int id, [FromBody] Job updatedJob)
        {
            var existingJob = await _context.Jobs.FindAsync(id);

            if (existingJob == null)
                return NotFound(new { message = "Job not found" });

            existingJob.Title = updatedJob.Title;
            existingJob.Department = updatedJob.Department;
            existingJob.Location = updatedJob.Location;
            existingJob.WorkMode = updatedJob.WorkMode;
            existingJob.EmploymentType = updatedJob.EmploymentType;
            existingJob.ExperienceLevel = updatedJob.ExperienceLevel;

            existingJob.MinSalary = updatedJob.MinSalary;
            existingJob.MaxSalary = updatedJob.MaxSalary;
            existingJob.Currency = updatedJob.Currency;

            existingJob.Skills = updatedJob.Skills;

            existingJob.Description = updatedJob.Description;
            existingJob.Requirements = updatedJob.Requirements;

            existingJob.ClosingDate = updatedJob.ClosingDate;
            existingJob.Status = updatedJob.Status;

            await _context.SaveChangesAsync();

            return Ok(existingJob);
        }

        // DELETE: api/jobs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var job = await _context.Jobs.FindAsync(id);

            if (job == null)
                return NotFound(new { message = "Job not found" });

            _context.Jobs.Remove(job);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Job deleted successfully"
            });
        }
    }
}