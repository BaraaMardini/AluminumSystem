using System.ComponentModel.DataAnnotations;

public class ProductsUpdateDTO
{
 [Required]
    public int  ID { get; set; }
    public string?  Description { get; set; }
    public bool?  IsActive { get; set; }

    public ProductsUpdateDTO() { }

    public ProductsUpdateDTO(int iD, string productName, string description, bool isActive, DateTime createdAt, DateTime updatedAt)
    {
        Description = description;
        IsActive = isActive;
    }
}

