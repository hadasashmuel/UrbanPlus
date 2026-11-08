
using BLL.Services.ServicesDB.VoteServices;
using DTO.VoteDTO;
using Microsoft.AspNetCore.Authorization;
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

            return Ok(vote);
        }

        // POST: api/Vote
        [Authorize]
        [HttpPost]
        public ActionResult<ShowVoteDTO> CreateVotes([FromBody] CreateVoteDTO dto)
        {
            var createdVote = _voteService.CreateVotes(
                dto, User.GetUserId());

            return Ok(createdVote);
        }

        // DELETE: api/Vote/5
        [Authorize]
        [HttpDelete("{id}")]
        public IActionResult DeleteVote(int id)
        {
            _voteService.DeleteVote(id, User.GetUserId());

            return NoContent();
        }
    }
}
