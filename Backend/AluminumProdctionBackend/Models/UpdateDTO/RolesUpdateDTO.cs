using System.ComponentModel.DataAnnotations;

public class RolesUpdateDTO
{
 [Required]
    public int  ID { get; set; }
    public string?  Description { get; set; }
    public bool?  IsActive { get; set; }

    public RolesUpdateDTO() { }

    public RolesUpdateDTO(int iD, string roleName, string description, bool isActive)
    {
        Description = description;
        IsActive = isActive;
    }
}

