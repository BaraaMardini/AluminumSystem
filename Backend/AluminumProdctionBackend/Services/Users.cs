using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public static class UsersService
{
    // =====================================================
    // GET ALL
    // =====================================================

    public static async Task<ApiResult<List<UsersViewDTO>>> GetAllUsersAsync(
        CancellationToken cancellationToken = default)
    {
        var result =
            await UsersData.GetAllUsersAsync(
                cancellationToken);

        if (result.Data == null ||
            result.Data.Count == 0)
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


    // =====================================================
    // ADD USER
    // =====================================================

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

        if (result.Data != null)
        {
            result.Data.Password = null;
        }

        return result;
    }


    // =====================================================
    // UPDATE PASSWORD
    // =====================================================

    public static async Task<ApiResult<object>> UpdateUserPasswordAsync(
        UsersUpdateDTO dto,
        CancellationToken cancellationToken = default)
    {
        if (dto == null)
        {
            return new ApiResult<object>
            {
                Data = null,
                Message = "بيانات المستخدم غير صالحة.",
                ErrorType = ErrorType.InvalidId
            };
        }

        if (string.IsNullOrWhiteSpace(dto.Email))
        {
            return new ApiResult<object>
            {
                Data = null,
                Message = "البريد الإلكتروني مطلوب.",
                ErrorType = ErrorType.InvalidId
            };
        }

        if (string.IsNullOrWhiteSpace(dto.OldPassword))
        {
            return new ApiResult<object>
            {
                Data = null,
                Message = "كلمة المرور القديمة مطلوبة.",
                ErrorType = ErrorType.InvalidId
            };
        }

        if (string.IsNullOrWhiteSpace(dto.NewPassword))
        {
            return new ApiResult<object>
            {
                Data = null,
                Message = "كلمة المرور الجديدة مطلوبة.",
                ErrorType = ErrorType.InvalidId
            };
        }

        if (dto.NewPassword == dto.OldPassword)
        {
            return new ApiResult<object>
            {
                Data = null,
                Message = "كلمة المرور الجديدة يجب أن تكون مختلفة عن القديمة.",
                ErrorType = ErrorType.InvalidId
            };
        }

        // =================================================
        // Hash الجديدة
        // =================================================

        string newPasswordHash =
            BCrypt.Net.BCrypt.HashPassword(
                dto.NewPassword);

        var result =
            await UsersData.UpdateUserPasswordAsync(
                dto.Email,
                dto.OldPassword,
                newPasswordHash,
                cancellationToken);

        return result;
    }


    // =====================================================
    // SEARCH
    // =====================================================

    public static async Task<ApiResult<List<UsersViewDTO>>> SearchUsers(
        int? ID,
        string? UserName,
        bool? IsActive,
        CancellationToken cancellationToken = default)
    {
        var result =
            await UsersData.SearchUsers(
                ID,
                UserName,
                IsActive,
                cancellationToken);

        if (result.Data == null ||
            result.Data.Count == 0)
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


    // =====================================================
    // GET BY ID
    // =====================================================

    public static async Task<ApiResult<UsersViewDTO>> GetUsersByIDAsync(
        int ID,
        CancellationToken cancellationToken = default)
    {
        return await UsersData.GetUsersByIDAsync(
            ID,
            cancellationToken);
    }
}