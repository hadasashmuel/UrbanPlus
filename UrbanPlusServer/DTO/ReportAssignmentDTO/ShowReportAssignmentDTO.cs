namespace DTO.ReportAssignmentDTO
{
    public class ShowReportAssignmentDTO
    {
        public int AssignmentId { get; set; }

        public int ReportId { get; set; }

        public int ProviderId { get; set; }

        public string ProviderName { get; set; } = string.Empty;

        public int ManagerId { get; set; }

        public string ManagerName { get; set; } = string.Empty;

        public DateTime AssignedAt { get; set; }

        public bool IsCurrent { get; set; }
    }
}