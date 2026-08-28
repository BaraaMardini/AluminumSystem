using System.ComponentModel.DataAnnotations;

public class ProductionOrderStagesViewDTO
{
    public int ID { get; set; }
    public int OrderID { get; set; }
    public string StageName { get; set; }
    public string StatusName { get; set; }
    public DateTime CreatedAt { get; set; }

    public ProductionOrderStagesViewDTO() { }

    public ProductionOrderStagesViewDTO(int iD, int orderID, string stageName, string statusName, DateTime createdAt)
    {
        ID = iD;
        OrderID = orderID;
        StageName = stageName;
        StatusName = statusName;
        CreatedAt = createdAt;
    }
}

