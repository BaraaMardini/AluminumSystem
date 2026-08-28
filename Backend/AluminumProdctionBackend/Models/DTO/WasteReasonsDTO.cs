using System.ComponentModel.DataAnnotations;

public class WasteReasonsDTO
{
    public int ID { get; set; }
    public string NameAr { get; set; }

    public WasteReasonsDTO() { }

    public WasteReasonsDTO(int iD, string nameAr)
    {
        ID = iD;
        NameAr = nameAr;
    }
}

