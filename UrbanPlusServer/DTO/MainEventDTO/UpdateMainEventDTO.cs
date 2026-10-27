using DAL.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DTO.MainEventDTO
{
    public class UpdateMainEventDTO
    {
        [Required]
        public int CategoryId { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public EventStatus Status { get; set; }
        [Required]
        public Severity Severity { get; set; }
        [Required]
        public int EstimatedResolutionMinutes { get; set; }
    }
}
