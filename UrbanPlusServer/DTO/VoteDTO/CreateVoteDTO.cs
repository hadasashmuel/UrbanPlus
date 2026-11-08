
using DAL.Entities;
using System.ComponentModel.DataAnnotations;

namespace DTO.VoteDTO
{
    public class CreateVoteDTO
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "MainEventId must be greater than 0")]
        public int MainEventId { get; set; }

        [Required]
        [EnumDataType(typeof(VoteType), ErrorMessage = "Invalid vote type")]
        public VoteType TypeVote { get; set; }
    }
}
