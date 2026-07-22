using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TalentFlow.API.Models;

namespace TalentFlow.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        public DbSet<Evaluation> Evaluations { get; set; }

        public DbSet<Interview> Interviews { get; set; }

        public DbSet<CandidateProfile> CandidateProfiles { get; set; }

        public DbSet<Application> Applications { get; set; }

        public DbSet<Job> Jobs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            var skillsConverter =
                new ValueConverter<List<string>, string>(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null)
                         ?? new List<string>()
                );

            modelBuilder.Entity<Job>()
                .Property(j => j.Skills)
                .HasConversion(skillsConverter);

            base.OnModelCreating(modelBuilder);
        }
    }
}