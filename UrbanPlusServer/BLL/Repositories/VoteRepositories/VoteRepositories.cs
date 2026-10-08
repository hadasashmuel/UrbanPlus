using AutoMapper;
using AutoMapper.QueryableExtensions;
using DAL;
using DTO.VoteDTO;

namespace BLL.Repositories.VoteRepositories
{
    public class VoteRepositories
    {
        private readonly UrbanPlusContext _context;
        private readonly IMapper _mapper;

        public VoteRepositories(UrbanPlusContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public List<ShowVoteDTO> GetAllVotes()
        {
            return _context.Categories
               .ProjectTo<ShowVoteDTO>(_mapper.ConfigurationProvider)
               .ToList();
        }
        public ShowVoteDTO CreateVote(CreateVoteDTO dto)
        {
            var votes = _mapper.Map<Votes>(dto);


            _context.Votes.Add(votes);
            _context.SaveChanges();

            var created = _context.Votes
                .First(r => r.VoteId == votes.VoteId);

            return _mapper.Map<ShowVoteDTO>(created);
        }


        public ShowVoteDTO? GetVotesById(int id)
        {
            return _context.Votes
              .Where(c => c.VoteId == id)
              .ProjectTo<ShowVoteDTO>(_mapper.ConfigurationProvider)
              .FirstOrDefault();
        }


        public bool DeleteVotes(int id)
        {
            var votes = _context.Votes.Find(id);
            if (votes is null)
                return false;

            _context.Votes.Remove(votes);
            _context.SaveChanges();
            return true;
        }
    }
}
