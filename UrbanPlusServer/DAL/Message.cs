using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DAL
{
    public class Message
    {
        [Key]
        public int MessageId { get; set; }

        [ForeignKey("UserId")]
        public int UserId { get; set; }

        [ForeignKey("MainEventId")]
        public int MainEventId { get; set; }

        [MaxLength(100)]
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }

        public bool IsDeleted { get; set; }
        public Users? User { get; set; }
        public MainEvents? MainEvent { get; set; }


    }
}
