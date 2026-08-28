using System.ComponentModel.DataAnnotations;

public class UsersViewDTO
{
    public int ID { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
    public string FullName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string RoleName { get; set; }
    public bool IsActive { get; set; }

    public UsersViewDTO() { }

    public UsersViewDTO(int iD, string userName, string email, string fullName, DateTime createdAt, DateTime updatedAt, string roleName, bool isActive)
    {
        ID = iD;
        UserName = userName;
        Email = email;
        FullName = fullName;
        CreatedAt = createdAt;
        UpdatedAt = updatedAt;
        RoleName = roleName;
        IsActive = isActive;
    }
}

