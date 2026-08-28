using System.ComponentModel.DataAnnotations;

public class ProductionStageEntriesViewDTO
{
    public int ID { get; set; }
    public int OrderID { get; set; }
    public int OrderStageID { get; set; }
 
    public int Quantity { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Notes { get; set; }
    public string UserName { get; set; }

    public ProductionStageEntriesViewDTO() { }

    public ProductionStageEntriesViewDTO(int iD, int orderID, int orderStageID,  int quantity, DateTime createdAt, string notes, string userName)
    {
        ID = iD;
        OrderID = orderID;
        OrderStageID = orderStageID;
  
        Quantity = quantity;
        CreatedAt = createdAt;
        Notes = notes;
        UserName = userName;
    }
}

