using DAL;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DTO.VoteDTO
{
    public class ShowVoteDTO
    {     
        public int VoteId { get; set; }
        public int UserId { get; set; }
        public int MainEventId { get; set; }
        public VoteType TypeVote { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
