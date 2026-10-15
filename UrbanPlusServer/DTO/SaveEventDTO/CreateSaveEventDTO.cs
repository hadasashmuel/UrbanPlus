using DAL;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DTO.SaveEventDTO
{
    public class CreateSaveEventDTO
    {
        public int MainEventId { get; set; }
    }
}
