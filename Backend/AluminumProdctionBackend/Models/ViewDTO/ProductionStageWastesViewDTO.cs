using System.ComponentModel.DataAnnotations;

public class ProductionStageWastesViewDTO
{
    public int ID { get; set; }
    public int StageEntryID { get; set; }
    public string StageName { get; set; }
    public int WasteQuantity { get; set; }
    public string CreatedBy { get; set; }
    public string WasteTypesName { get; set; }
    public string WasteReasonsName { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Notes { get; set; }

    public ProductionStageWastesViewDTO() { }

    public ProductionStageWastesViewDTO(int iD, int stageEntryID, string stageName, int wasteQuantity, string createdBy, string wasteTypesName, string wasteReasonsName, DateTime createdAt, string notes)
    {
        ID = iD;
        StageEntryID = stageEntryID;
        StageName = stageName;
        WasteQuantity = wasteQuantity;
        CreatedBy = createdBy;
        WasteTypesName = wasteTypesName;
        WasteReasonsName = wasteReasonsName;
        CreatedAt = createdAt;
        Notes = notes;
    }
}

