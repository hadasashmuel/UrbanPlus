
using DTO.VoteDTO;

namespace BLL.Services.ServicesDB.VoteServices
{
    public interface IVoteService
    {
        List<ShowVoteDTO> GetAllVotes();
        ShowVoteDTO GetVoteById(int id);
        List<ShowVoteDTO> GetVotesByUser(int userId);
        ShowVoteDTO CreateVotes(CreateVoteDTO dto, int userId);
        bool DeleteVote(int voteId, int userId);
    }
}
