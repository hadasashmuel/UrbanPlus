using DTO.VoteDTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Repositories.VoteRepositories
{
    public interface IVoteRepositories
    {
        List<ShowVoteDTO> GetAllVotes();
        ShowVoteDTO? GetVoteById(int id);
        ShowVoteDTO CreateVotes(CreateVoteDTO dto);
        bool DeleteVote(int id);
    }
}
