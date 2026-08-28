using System.ComponentModel.DataAnnotations;

public class WasteTypesUpdateDTO
{
 [Required]
    public int  ID { get; set; }
    public bool?  IsActive { get; set; }

    public WasteTypesUpdateDTO() { }

    public WasteTypesUpdateDTO(int iD, string nameAr, bool isActive)
    {
        IsActive = isActive;
    }
}

