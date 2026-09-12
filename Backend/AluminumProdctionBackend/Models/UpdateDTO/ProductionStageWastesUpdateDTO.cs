using System.ComponentModel.DataAnnotations;

public class ProductionStageWastesUpdateDTO
{
 [Required]
    public int  ID { get; set; }
    public string?  Notes { get; set; }

    public ProductionStageWastesUpdateDTO() { }

    public ProductionStageWastesUpdateDTO(int iD, int stageEntryID, int wasteQuantity, string email, string notes, int wasteTypeID, int wasteReasonID)
    {
        Notes = notes;
    }
}

