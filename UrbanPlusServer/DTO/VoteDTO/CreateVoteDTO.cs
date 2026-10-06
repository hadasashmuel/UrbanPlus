using DAL;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DTO.VoteDTO
{
    public class CreateVoteDTO
    {
        public int MainEventId { get; set; }
        public VoteType TypeVote { get; set; }

    }
}
