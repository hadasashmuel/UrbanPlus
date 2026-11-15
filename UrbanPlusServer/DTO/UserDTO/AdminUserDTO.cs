namespace DTO.UserDTO
{
    public class AdminUserDTO
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string? ProfilePicture { get; set; }
        public int RoleCode { get; set; }
        public double ScoreReliability { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}