
namespace DTO.WorkTypeDTO
{
    public class ShowWorkTypeDTO
    {
        public int WorkTypeId { get; set; }

        public int CategoryId { get; set; }

        public string NameWorkTypes { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string CategoryName { get; set; } = string.Empty;
    }
}
