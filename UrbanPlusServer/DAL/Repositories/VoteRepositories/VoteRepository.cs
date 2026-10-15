using DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories.VoteRepositories
{
    public class VoteRepository : IVoteRepository
    {
        private readonly UrbanPlusContext _context;

        public VoteRepository(UrbanPlusContext context)
        {
            _context = context;
        }

        public List<Votes> GetAll()
        {
            return _context.Votes.AsNoTracking().ToList();
        }

        public Votes? GetById(int id)
        {
            return _context.Votes
                .FirstOrDefault(v => v.VoteId == id);
        }

        public Votes Add(Votes vote)
        {
            _context.Votes.Add(vote);
            _context.SaveChanges();

            return vote;
        }

        public bool Delete(int id)
        {
            var vote = _context.Votes.Find(id);

            if (vote == null)
                return false;

            _context.Votes.Remove(vote);
            _context.SaveChanges();

            return true;
        }

        public bool ExistsForUserAndMainEvent(int userId, int mainEventId)
        {
            return _context.Votes.Any(v =>
                v.UserId == userId &&
                v.MainEventId == mainEventId);
        }
    }
}
