namespace DTO.ReportImageDTO
{
    public class ShowReportImageDTO
    {
        public int ReportImageId { get; set; }

        public int ReportId { get; set; }

        public string ImageUrl { get; set; } = string.Empty;
    }
}
