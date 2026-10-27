using DAL.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Repositories.VoteRepositories
{
    public interface IVoteRepository
    {
        List<Votes> GetAll();
        Votes? GetById(int id);
        Votes Add(Votes vote);
        bool Delete(int id);
        bool ExistsForUserAndMainEvent(int userId,int mainEventId);
        Votes? GetOwned(int id, int userId);
        List<Votes> GetByUser(int userId);
    }
}
