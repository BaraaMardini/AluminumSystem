using System.ComponentModel.DataAnnotations;

public class StatusesUpdateDTO
{
 [Required]
    public int  ID { get; set; }
    public string?  Description { get; set; }
    public bool?  IsActive { get; set; }

    public StatusesUpdateDTO() { }

    public StatusesUpdateDTO(int iD, string statusName, string description, bool isActive)
    {
        Description = description;
        IsActive = isActive;
    }
}

