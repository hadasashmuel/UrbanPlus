
using AutoMapper;
using DAL.Repositories.VoteRepositories;
using DTO.VoteDTO;
using DAL.Entities;
namespace BLL.Services.ServicesDB.VoteServices
{
    public class VoteService : IVoteService
    {
        private readonly IVoteRepository _voteRepository;
        private readonly IMapper _mapper;

        public VoteService(IVoteRepository voteRepository, IMapper mapper)
        {
            _voteRepository = voteRepository;
            _mapper = mapper;
        }

        public List<ShowVoteDTO> GetAllVotes()
        {
            var votes = _voteRepository.GetAll();

            return _mapper.Map<List<ShowVoteDTO>>(votes);
        }

        public ShowVoteDTO? GetVoteById(int id)
        {
            var vote = _voteRepository.GetById(id);

            if (vote == null)
                return null;

            return _mapper.Map<ShowVoteDTO>(vote);
        }


        public ShowVoteDTO CreateVotes(CreateVoteDTO dto, int userId)
        {
            var alreadyVoted =
       _voteRepository.ExistsForUserAndMainEvent(
           userId, dto.MainEventId);

            if (alreadyVoted)
            {
                throw new InvalidOperationException("The user has already voted for this event.");
            }

            var vote = _mapper.Map<Votes>(dto);

            vote.UserId = userId;
            vote.CreatedAt = DateTime.UtcNow;

            var createdVote = _voteRepository.Add(vote);

            return _mapper.Map<ShowVoteDTO>(createdVote);
        }

        public bool DeleteVote(int id, int userId)
        {
            var vote = _voteRepository.GetOwned(id, userId);

            if (vote is null)
                return false;

            _voteRepository.Delete(vote.VoteId);
            return true;
        }
    }
}