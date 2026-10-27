using DAL.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DTO.VoteDTO
{
    public class CreateVoteDTO
    {
        [Required]
        public int MainEventId { get; set; }
        [Required]
        public VoteType TypeVote { get; set; }

    }
}
