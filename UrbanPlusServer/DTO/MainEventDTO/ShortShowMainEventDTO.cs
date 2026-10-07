using DAL;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DTO.MainEventDTO
{
    internal class ShortShowMainEventDTO
    {
        public int MainEventsId { get; set; }
        public int CategoryId { get; set; }
        public string Title { get; set; }
        public EventStatus Status { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Address { get; set; }
        public Severity Severity { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CategoryName { get; set; }
        public int CountVotes { get; set; }
    }
}
