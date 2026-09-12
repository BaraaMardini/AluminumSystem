using System.ComponentModel.DataAnnotations;

public class UsersDTO
{
    public int ID { get; set; }

    public string UserName { get; set; }

    public string Password { get; set; }

    public string FullName { get; set; }

    public string Email { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Invalid RoleID.")]
    public int RoleID { get; set; }

    public List<Permissions>? Permissions { get; set; }

    public UsersDTO()
    {
    }

    public UsersDTO(
        int id,
        string userName,
        string password,
        string fullName,
        string email,
        int roleID)
    {
        ID = id;
        UserName = userName;
        Password = password;
        FullName = fullName;
        Email = email;
        RoleID = roleID;
    }
}