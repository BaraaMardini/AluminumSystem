using System.ComponentModel.DataAnnotations;

public class ProductionOrdersUpdateDTO
{
 [Required]
    public int  ID { get; set; }

    public int StatusID { get; set; }
    public ProductionOrdersUpdateDTO() { }

    public ProductionOrdersUpdateDTO(int iD, int statusID)
    {
        StatusID= statusID; 
    }
}

