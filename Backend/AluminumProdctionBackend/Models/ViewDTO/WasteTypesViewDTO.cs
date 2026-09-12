using System.ComponentModel.DataAnnotations;

public class WasteTypesViewDTO
{
    public int ID { get; set; }
    public string NameAr { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }

    public WasteTypesViewDTO() { }

    public WasteTypesViewDTO(int iD, string nameAr, bool isActive, DateTime createdAt)
    {
        ID = iD;
        NameAr = nameAr;
        IsActive = isActive;
        CreatedAt = createdAt;
    }
}

