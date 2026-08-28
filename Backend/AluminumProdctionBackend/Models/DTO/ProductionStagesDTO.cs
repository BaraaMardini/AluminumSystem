using System.ComponentModel.DataAnnotations;

public class ProductionStagesDTO
{
    public int ID { get; set; }
    public string StageName { get; set; }
    public string Description { get; set; }
    public int DisplayOrder { get; set; }

    public ProductionStagesDTO() { }

    public ProductionStagesDTO(int iD, string stageName, string description, int displayOrder)
    {
        ID = iD;
        StageName = stageName;
        Description = description;
        DisplayOrder = displayOrder;
    }
}

