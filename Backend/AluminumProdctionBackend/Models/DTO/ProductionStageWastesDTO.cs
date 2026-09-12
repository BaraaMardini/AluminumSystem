using System.ComponentModel.DataAnnotations;

public class ProductionStageWastesDTO
{
    public int ID { get; set; }
    [Range(1, int.MaxValue, ErrorMessage = "Invalid StageEntryID.")]
    public int StageEntryID { get; set; }
    public int WasteQuantity { get; set; }
    public string Email { get; set; }
    public string Notes { get; set; }
    [Range(1, int.MaxValue, ErrorMessage = "Invalid WasteTypeID.")]
    public int WasteTypeID { get; set; }
    [Range(1, int.MaxValue, ErrorMessage = "Invalid WasteReasonID.")]
    public int WasteReasonID { get; set; }

    public ProductionStageWastesDTO() { }

    public ProductionStageWastesDTO(int iD, int stageEntryID, int wasteQuantity, string email, string notes, int wasteTypeID, int wasteReasonID)
    {
        ID = iD;
        StageEntryID = stageEntryID;
        WasteQuantity = wasteQuantity;
        Email = email;
        Notes = notes;
        WasteTypeID = wasteTypeID;
        WasteReasonID = wasteReasonID;
    }
}

