
using BLL.Services.ServicesDB.VoteServices;
using DTO.VoteDTO;
using Microsoft.AspNetCore.Mvc;

namespace UrbanPlusServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VoteController : ControllerBase
    {
        private readonly IVoteService _voteService;

        public VoteController(IVoteService voteService)
        {
            _voteService = voteService;
        }

        // GET: api/Vote
        [HttpGet]
        public ActionResult<List<ShowVoteDTO>> GetAllVotes()
        {
            var votes = _voteService.GetAllVotes();

            return Ok(votes);
        }

        // GET: api/Vote/5
        [HttpGet("{id}")]
        public ActionResult<ShowVoteDTO> GetVoteById(int id)
        {
            var vote = _voteService.GetVoteById(id);

            if (vote == null)
                return NotFound();

            return Ok(vote);
        }

        // POST: api/Vote?userId=5
        [HttpPost]
        public ActionResult<ShowVoteDTO> CreateVote([FromBody] CreateVoteDTO dto, [FromQuery] int userId)
        {
            try
            {
                var createdVote = _voteService.CreateVotes(dto, userId);

                return CreatedAtAction(
                    nameof(GetVoteById),
                    new { id = createdVote.VoteId },
                    createdVote);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        // DELETE: api/Vote/5
        [HttpDelete("{id}")]
        public IActionResult DeleteVote(int id)
        {
            var deleted = _voteService.DeleteVote(id);

            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}
