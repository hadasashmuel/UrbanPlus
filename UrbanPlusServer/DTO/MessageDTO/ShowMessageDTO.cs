using DAL;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DTO.MessageDTO
{
    public class ShowMessageDTO
    {
        public int MessageId { get; set; }
        public int UserId { get; set; }
        public int MainEventId { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsDeleted { get; set; }
        public string UserName { get; set; }
    }
}
