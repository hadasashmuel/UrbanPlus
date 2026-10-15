using DAL;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DTO.SaveEventDTO
{
    public class ShowSavedEventsDTO
    {
            public int SavedEventId { get; set; }
            public int UserId { get; set; }
            public int MainEventId { get; set; }
            public DateTime CreatedAt { get; set; }

    }
}
