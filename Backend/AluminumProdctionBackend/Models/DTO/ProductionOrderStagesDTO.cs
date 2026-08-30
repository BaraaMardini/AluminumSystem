using System.ComponentModel.DataAnnotations;

public class ProductionOrderStagesDTO
{
    public int ID { get; set; }
    [Range(1, int.MaxValue, ErrorMessage = "Invalid OrderID.")]
    public int OrderID { get; set; }

    public string Email { get; set; }

    public ProductionOrderStagesDTO() { }

    public ProductionOrderStagesDTO(int iD, int orderID, string email)
    {
        ID = iD;
        OrderID = orderID;

        Email = email;
    }
}

