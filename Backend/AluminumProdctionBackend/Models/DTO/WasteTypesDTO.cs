using System.ComponentModel.DataAnnotations;

public class WasteTypesDTO
{
    public int ID { get; set; }
    public string NameAr { get; set; }


    public WasteTypesDTO() { }

    public WasteTypesDTO(int iD, string nameAr)
    {
        ID = iD;
        NameAr = nameAr;
   }
}

