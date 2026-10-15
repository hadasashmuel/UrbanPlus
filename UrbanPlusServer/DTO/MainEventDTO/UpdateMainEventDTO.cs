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
        public int CategoryId { get; set; }
        public string Title { get; set; }
        public EventStatus Status { get; set; }
        public Severity Severity { get; set; }
        public int EstimatedResolutionMinutes { get; set; }
    }
}
