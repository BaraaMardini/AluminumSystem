using System.ComponentModel.DataAnnotations;

public class RolesViewDTO
{
    public int ID { get; set; }
    public string RoleName { get; set; }
    public string Description { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public RolesViewDTO() { }

    public RolesViewDTO(int iD, string roleName, string description, bool isActive, DateTime createdAt, DateTime updatedAt)
    {
        ID = iD;
        RoleName = roleName;
        Description = description;
        IsActive = isActive;
        CreatedAt = createdAt;
        UpdatedAt = updatedAt;
    }
}

