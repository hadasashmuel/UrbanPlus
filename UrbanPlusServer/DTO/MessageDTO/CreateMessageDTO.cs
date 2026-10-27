using DAL;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DTO.MessageDTO
{
    public class CreateMessageDTO
    {
        [Required]
        public int MainEventId { get; set; }
        [Required]
        public string Content { get; set; }
    }
}
