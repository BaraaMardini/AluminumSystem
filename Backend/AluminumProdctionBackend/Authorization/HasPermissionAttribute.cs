using Microsoft.AspNetCore.Authorization;

public class HasPermissionAttribute : AuthorizeAttribute
{
    public HasPermissionAttribute(long permissionMask)
    {
        Policy = $"Permission_{permissionMask}";
    }
}