using System.ComponentModel.DataAnnotations;

public class ProductsDTO
{
    public int ID { get; set; }
    public string ProductName { get; set; }
    public string Description { get; set; }


    public ProductsDTO() { }

    public ProductsDTO(int iD, string productName, string description)
    {
        ID = iD;
        ProductName = productName;
        Description = description;
     

    }
}

