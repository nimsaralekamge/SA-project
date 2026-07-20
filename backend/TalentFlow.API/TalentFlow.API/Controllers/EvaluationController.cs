using Microsoft.AspNetCore.Mvc;
using TalentFlow.API.Data;
using TalentFlow.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace TalentFlow.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EvaluationController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EvaluationController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Evaluation
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Evaluation>>> GetEvaluations()
        {
            return await _context.Evaluations.ToListAsync();
        }

        // POST: api/Evaluation
        [HttpPost]
        public async Task<ActionResult<Evaluation>> PostEvaluation([FromBody] Evaluation evaluation)
        {
            // Automatically calculate the weighted overall match score if not provided
            if (evaluation.OverallMatchScore == 0)
            {
                evaluation.OverallMatchScore = (int)Math.Round(
                    (evaluation.TechnicalDepthScore * 0.4) +
                    (evaluation.SystemDesignScore * 0.3) +
                    (evaluation.CommunicationScore * 0.2) +
                    (evaluation.CultureAlignmentScore * 0.1)
                );
            }

            evaluation.CreatedAt = DateTime.UtcNow;

            _context.Evaluations.Add(evaluation);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEvaluations), new { id = evaluation.Id }, evaluation);
        }
    }
}