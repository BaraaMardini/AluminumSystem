using System.ComponentModel.DataAnnotations;

public class StatusesDTO
{
    public int ID { get; set; }
    public string StatusName { get; set; }
    public string Description { get; set; }
  
    public StatusesDTO() { }

    public StatusesDTO(int iD, string statusName, string description)
    {
        ID = iD;
        StatusName = statusName;
        Description = description;
  
    }
}

