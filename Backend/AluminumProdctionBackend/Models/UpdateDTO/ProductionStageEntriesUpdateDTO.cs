using System.ComponentModel.DataAnnotations;

public class ProductionStageEntriesUpdateDTO
{
 [Required]
    public int  ID { get; set; }
    public string?  Notes { get; set; }

    public ProductionStageEntriesUpdateDTO() { }

    public ProductionStageEntriesUpdateDTO(int iD, int orderStageID, int quantity, string email, string notes)
    {
        Notes = notes;
    }
}

