using System.ComponentModel.DataAnnotations;

public class ProductionStageEntriesDTO
{
    public int ID { get; set; }
    public int OrderStageID { get; set; }
    public int Quantity { get; set; }
    public string Email { get; set; }
    public string Notes { get; set; }

    public ProductionStageEntriesDTO() { }

    public ProductionStageEntriesDTO(int iD, int orderStageID, int quantity, string email, string notes)
    {
        ID = iD;
        OrderStageID = orderStageID;
        Quantity = quantity;
        Email = email;
        Notes = notes;
    }
}

