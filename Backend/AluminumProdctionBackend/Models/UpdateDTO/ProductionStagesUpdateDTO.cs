using System.ComponentModel.DataAnnotations;

public class ProductionStagesUpdateDTO
{
 [Required]
    public int  ID { get; set; }
    public string?  Description { get; set; }
    public bool?  IsActive { get; set; }

    public ProductionStagesUpdateDTO() { }

    public ProductionStagesUpdateDTO(int iD, string stageName, string description, int displayOrder, bool isActive)
    {
        Description = description;
        IsActive = isActive;
    }
}

