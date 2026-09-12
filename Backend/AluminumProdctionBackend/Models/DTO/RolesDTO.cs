using System.ComponentModel.DataAnnotations;

public class RolesDTO
{
    public int ID { get; set; }
    public string RoleName { get; set; }
    public string Description { get; set; }

    public RolesDTO() { }

    public RolesDTO(int iD, string roleName, string description)
    {
        ID = iD;
        RoleName = roleName;
        Description = description;
    }
}

