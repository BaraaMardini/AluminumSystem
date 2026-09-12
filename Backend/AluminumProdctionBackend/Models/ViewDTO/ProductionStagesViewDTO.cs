using System.ComponentModel.DataAnnotations;

public class ProductionStagesViewDTO
{
    public int ID { get; set; }
    public string StageName { get; set; }
    public string Description { get; set; }
    public int DisplayOrder { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsActive { get; set; }

    public ProductionStagesViewDTO() { }

    public ProductionStagesViewDTO(int iD, string stageName, string description, int displayOrder, DateTime createdAt,  bool isActive)
    {
        ID = iD;
        StageName = stageName;
        Description = description;
        DisplayOrder = displayOrder;
        CreatedAt = createdAt;
      
        IsActive = isActive;
    }
}

