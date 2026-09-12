using System.ComponentModel.DataAnnotations;

public class WasteReasonsUpdateDTO
{
 [Required]
    public int  ID { get; set; }
    public bool?  IsActive { get; set; }

    public WasteReasonsUpdateDTO() { }

    public WasteReasonsUpdateDTO(int iD, string nameAr, bool isActive)
    {
        IsActive = isActive;
    }
}

