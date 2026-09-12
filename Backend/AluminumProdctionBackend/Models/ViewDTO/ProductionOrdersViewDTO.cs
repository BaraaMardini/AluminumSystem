using System.ComponentModel.DataAnnotations;

public class ProductionOrdersViewDTO
{
    public int ID { get; set; }
    public string ProductName { get; set; }
    public int RequestedQuantity { get; set; }
    public string StatusName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string Notes { get; set; }
    public string CreatedBy { get; set; }

    public ProductionOrdersViewDTO() { }

    public ProductionOrdersViewDTO(int iD, string productName, int requestedQuantity, string statusName, DateTime createdAt, DateTime updatedAt, string notes, string createdBy)
    {
        ID = iD;
        ProductName = productName;
        RequestedQuantity = requestedQuantity;
        StatusName = statusName;
        CreatedAt = createdAt;
        UpdatedAt = updatedAt;
        Notes = notes;
        CreatedBy = createdBy;
    }
}

