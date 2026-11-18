namespace DTO.ProviderWorkTypeDTO
{
    public class ShowProviderWorkTypeDTO
    {
        public int ProviderWorkTypesId { get; set; }
        public int ProviderId { get; set; }
        public string ProviderName { get; set; } = string.Empty;
        public int WorkTypeId { get; set; }
        public string NameWorkTypes { get; set; } = string.Empty;
    }
}