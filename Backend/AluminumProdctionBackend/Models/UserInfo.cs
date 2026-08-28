namespace BackendHospital.Models
{
    public class UserInfo
    {
        public int UserID { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public long PermissionMask { get; set; }


        public string Role { get; set; }



    }
}
