using Microsoft.AspNetCore.Authorization;

public class PermissionRequirement : IAuthorizationRequirement
{
    public long PermissionMask { get; }

    public PermissionRequirement(long permissionMask)
    {
        PermissionMask = permissionMask;
    }
}