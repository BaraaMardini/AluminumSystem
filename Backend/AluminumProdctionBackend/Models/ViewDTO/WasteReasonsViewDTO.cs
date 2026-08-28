using System.ComponentModel.DataAnnotations;

public class WasteReasonsViewDTO
{
    public int ID { get; set; }
    public string NameAr { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }

    public WasteReasonsViewDTO() { }

    public WasteReasonsViewDTO(int iD, string nameAr, bool isActive, DateTime createdAt)
    {
        ID = iD;
        NameAr = nameAr;
        IsActive = isActive;
        CreatedAt = createdAt;
    }
}

