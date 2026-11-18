
namespace DTO.ServiceProviderDTO
{
    public class ShowServiceProviderDTO
    {
        public int ProviderId { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string? Department { get; set; }

        public string? Phone { get; set; }

        public string? Email { get; set; }

        public bool IsActive { get; set; }
    }
}
