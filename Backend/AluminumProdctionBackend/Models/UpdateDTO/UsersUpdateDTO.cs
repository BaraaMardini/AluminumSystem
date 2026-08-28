using System.ComponentModel.DataAnnotations;

public class UsersUpdateDTO
{
    [Required]
    public int ID { get; set; }
    public string? PasswordHash { get; set; }
    public string? Email { get; set; }
    public bool? IsActive { get; set; }


    public UsersUpdateDTO() { }

    public UsersUpdateDTO(int iD, string userName, string passwordHash, string fullName, string email, bool isActive)
    {
        PasswordHash = passwordHash;
        Email = email;
        IsActive = isActive;
     
   
    }
}
