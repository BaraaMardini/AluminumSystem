using System.ComponentModel.DataAnnotations;

public class ProductionOrdersDTO
{
    public int ID { get; set; }
    [Range(1, int.MaxValue, ErrorMessage = "Invalid ProductID.")]
    public int ProductID { get; set; }
 
    public int RequestedQuantity { get; set; }
    [Range(1, int.MaxValue, ErrorMessage = "Invalid StatusID.")]
    public int StatusID { get; set; }
    public string Email { get; set; }
    public string Notes { get; set; }

    public ProductionOrdersDTO() { }

    public ProductionOrdersDTO(int iD, int productID,  int requestedQuantity, int statusID, string email, string notes)
    {
        ID = iD;
        ProductID = productID;
     
        RequestedQuantity = requestedQuantity;
        StatusID = statusID;
        Email = email;
        Notes = notes;
    }
}

