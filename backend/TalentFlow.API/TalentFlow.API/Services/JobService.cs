using Microsoft.EntityFrameworkCore;
using TalentFlow.API.Data;
using TalentFlow.API.Models;

namespace TalentFlow.API.Services;

public class JobService
{
    private readonly AppDbContext _context;

    public JobService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Job>> GetAllJobsAsync()
    {
        return await _context.Jobs.ToListAsync();
    }

    public async Task<Job?> GetJobByIdAsync(int id)
    {
        return await _context.Jobs.FindAsync(id);
    }

    public async Task<Job> CreateJobAsync(Job job)
    {
        _context.Jobs.Add(job);
        await _context.SaveChangesAsync();
        return job;
    }

    public async Task<Job?> UpdateJobAsync(int id, Job updatedJob)
    {
        var job = await _context.Jobs.FindAsync(id);

        if (job == null)
            return null;

        job.Title = updatedJob.Title;
        job.Department = updatedJob.Department;
        job.Location = updatedJob.Location;
        job.WorkMode = updatedJob.WorkMode;
        job.MinSalary = updatedJob.MinSalary;
        job.MaxSalary = updatedJob.MaxSalary;
        job.Description = updatedJob.Description;
        job.Requirements = updatedJob.Requirements;

        await _context.SaveChangesAsync();

        return job;
    }

    public async Task<bool> DeleteJobAsync(int id)
    {
        var job = await _context.Jobs.FindAsync(id);

        if (job == null)
            return false;

        _context.Jobs.Remove(job);
        await _context.SaveChangesAsync();

        return true;
    }
}
