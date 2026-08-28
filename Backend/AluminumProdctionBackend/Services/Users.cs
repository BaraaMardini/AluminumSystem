using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public static class UsersService
{
    public static async Task<ApiResult<List<UsersViewDTO>>> GetAllUsersAsync(
        CancellationToken cancellationToken = default)
    {
        var result = await UsersData.GetAllUsersAsync(cancellationToken);

        if (result.Data == null || result.Data.Count == 0)
        {
            return new ApiResult<List<UsersViewDTO>>(
                null,
                "لم يتم العثور على أي مستخدمين.",
                ErrorType.NotFound
            );
        }

        return new ApiResult<List<UsersViewDTO>>(
            result.Data,
            "تم استرجاع المستخدمين بنجاح.",
            ErrorType.None
        );
    }

    public static async Task<ApiResult<UsersDTO>> AddUsersAsync(
        UsersDTO dto,
        CancellationToken cancellationToken = default)
    {
        if (dto == null)
        {
            return new ApiResult<UsersDTO>
            {
                Data = null,
                Message = "لا يمكن أن يكون المستخدم فارغًا.",
                ErrorType = ErrorType.InvalidId
            };
        }

        if (string.IsNullOrWhiteSpace(dto.Password))
        {
            return new ApiResult<UsersDTO>
            {
                Data = null,
                Message = "كلمة المرور مطلوبة.",
                ErrorType = ErrorType.InvalidId
            };
        }

        string passwordHash =
            BCrypt.Net.BCrypt.HashPassword(dto.Password);

        dto.Password = passwordHash;

        var result =
            await UsersData.AddUsersAsync(
                dto,
                cancellationToken);

        // Never return password/hash to client
        if (result.Data != null)
        {
            result.Data.Password = null;
        }

        return result;
    }

    public static async Task<ApiResult<UsersDTO>> UpdateUsersByUsernameAndPasswordHashAsync(
        UsersUpdateDTO dto,
        CancellationToken cancellationToken = default)
    {
        if (dto == null)
        {
            return new ApiResult<UsersDTO>
            {
                Data = null,
                Message = "بيانات المستخدمين غير صالحة.",
                ErrorType = ErrorType.InvalidId
            };
        }

        string PassHash = BCrypt.Net.BCrypt.HashPassword(dto.PasswordHash);
        dto.PasswordHash = PassHash;

        return await UsersData.UpdateUsersByUsernameAndPasswordHashAsync(dto, cancellationToken);
    }


    public static async Task<ApiResult<List<UsersViewDTO>>> SearchUsers(
        int? ID,
        string? UserName,
        bool? IsActive,
        CancellationToken cancellationToken = default)
    {
        var result = await UsersData.SearchUsers(
            ID,
            UserName,
            IsActive,
            cancellationToken);

        if (result.Data == null || result.Data.Count == 0)
        {
            return new ApiResult<List<UsersViewDTO>>(
                null,
                "لم يتم العثور على أي مستخدمين.",
                ErrorType.NotFound
            );
        }

        return new ApiResult<List<UsersViewDTO>>(
            result.Data,
            "تم استرجاع المستخدمين بنجاح.",
            ErrorType.None
        );
    }


    public static async Task<ApiResult<UsersViewDTO>> GetUsersByIDAsync(
        int ID,
        CancellationToken cancellationToken = default)
    {
        return await UsersData.GetUsersByIDAsync(
            ID,
            cancellationToken);
    }
}