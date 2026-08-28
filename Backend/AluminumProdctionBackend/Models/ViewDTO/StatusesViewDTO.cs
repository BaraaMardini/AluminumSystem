using System.ComponentModel.DataAnnotations;

public class StatusesViewDTO
{
    public int ID { get; set; }
    public string StatusName { get; set; }
    public string Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool IsActive { get; set; }

    public StatusesViewDTO() { }

    public StatusesViewDTO(int iD, string statusName, string description, DateTime createdAt, DateTime updatedAt, bool isActive)
    {
        ID = iD;
        StatusName = statusName;
        Description = description;
        CreatedAt = createdAt;
        UpdatedAt = updatedAt;
        IsActive = isActive;
    }
}

