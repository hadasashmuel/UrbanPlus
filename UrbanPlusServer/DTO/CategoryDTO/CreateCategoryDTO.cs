using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DTO.CategoryDTO
{
    public class CreateCategoryDTO
    {
        public string CategoryName { get; set; }
        public string CategoryDescription { get; set; }
    }
}
