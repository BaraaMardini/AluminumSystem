using System.ComponentModel.DataAnnotations;

public class ProductsViewDTO
{
    public int ID { get; set; }
    public string ProductName { get; set; }
    public string Description { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public ProductsViewDTO() { }

    public ProductsViewDTO(int iD, string productName, string description, bool isActive, DateTime createdAt, DateTime updatedAt)
    {
        ID = iD;
        ProductName = productName;
        Description = description;
        IsActive = isActive;
        CreatedAt = createdAt;
        UpdatedAt = updatedAt;
    }
}

