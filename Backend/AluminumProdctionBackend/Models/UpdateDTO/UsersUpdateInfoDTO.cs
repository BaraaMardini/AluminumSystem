using System.ComponentModel.DataAnnotations;

public class UsersUpdateInfoDTO
{
    [Required]
    public int ID { get; set; }

    public string? UserName { get; set; }

    public string? FullName { get; set; }

    public bool? IsActive { get; set; }
}