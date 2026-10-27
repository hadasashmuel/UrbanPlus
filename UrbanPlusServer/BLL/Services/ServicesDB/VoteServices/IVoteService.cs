using DTO.VoteDTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Services.ServicesDB.VoteServices
{
    public interface IVoteService
    {
        List<ShowVoteDTO> GetAllVotes();

        ShowVoteDTO? GetVoteById(int id);

        ShowVoteDTO CreateVotes(CreateVoteDTO dto, int userId);
        bool DeleteVote(int voteId, int userId);
    }
}
