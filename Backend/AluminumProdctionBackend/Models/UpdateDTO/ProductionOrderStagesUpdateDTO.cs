using System.ComponentModel.DataAnnotations;

public class ProductionOrderStagesUpdateDTO
{
 [Required]
    public int  ID { get; set; }
    public int?  StatusID { get; set; }

    public ProductionOrderStagesUpdateDTO() { }

    public ProductionOrderStagesUpdateDTO(int iD, int orderID, int statusID)
    {
        StatusID = statusID;
    }
}

