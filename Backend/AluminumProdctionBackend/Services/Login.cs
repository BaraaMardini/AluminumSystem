using BackendHospital.Models;

public static class LoginService
{
    public static async Task<ApiResult<UserInfo>> Login(
        LoginRequest dto,
        CancellationToken cancellationToken = default)
    {
        // ==========================================
        // Validate Request
        // ==========================================

        if (dto == null)
        {
            return new ApiResult<UserInfo>
            {
                Data = null,
                Message = "طلب تسجيل الدخول مطلوب.",
                ErrorType = ErrorType.InvalidId
            };
        }

        // ==========================================
        // Username Required
        // ==========================================

        if (string.IsNullOrWhiteSpace(
                dto.Email))
        {
            return new ApiResult<UserInfo>
            {
                Data = null,
                Message = "اسم المستخدم مطلوب.",
                ErrorType = ErrorType.InvalidId
            };
        }

        // ==========================================
        // Password Required
        // ==========================================

        if (string.IsNullOrWhiteSpace(
                dto.Password))
        {
            return new ApiResult<UserInfo>
            {
                Data = null,
                Message = "كلمة المرور مطلوبة.",
                ErrorType = ErrorType.InvalidId
            };
        }

        // ==========================================
        // Get User From Database
        // ==========================================

        var result =
            await LoginData.Login(
                dto,
                cancellationToken);

        // ==========================================
        // Database Error
        // ==========================================

        if (result.ErrorType ==
            ErrorType.DatabaseError)
        {
            return result;
        }

        // ==========================================
        // User Not Found
        // ==========================================

        if (result.Data == null)
        {
            return new ApiResult<UserInfo>
            {
                Data = null,
                Message =
                    "اسم المستخدم أو كلمة المرور غير صحيحة.",
                ErrorType =
                    ErrorType.AlreadyExists
            };
        }

        // ==========================================
        // Validate Password Hash
        // ==========================================

        if (string.IsNullOrWhiteSpace(
                result.Data.PasswordHash))
        {
            return new ApiResult<UserInfo>
            {
                Data = null,
                Message =
                    "اسم المستخدم أو كلمة المرور غير صحيحة.",
                ErrorType =
                    ErrorType.AlreadyExists
            };
        }

        // ==========================================
        // Verify Password
        // ==========================================

        bool isPasswordValid;

        try
        {
            isPasswordValid =
                BCrypt.Net.BCrypt.Verify(
                    dto.Password,
                    result.Data.PasswordHash);
        }
        catch
        {
            return new ApiResult<UserInfo>
            {
                Data = null,
                Message =
                    "اسم المستخدم أو كلمة المرور غير صحيحة.",
                ErrorType =
                    ErrorType.AlreadyExists
            };
        }

        // ==========================================
        // Invalid Password
        // ==========================================

        if (!isPasswordValid)
        {
            return new ApiResult<UserInfo>
            {
                Data = null,
                Message =
                    "اسم المستخدم أو كلمة المرور غير صحيحة.",
                ErrorType =
                    ErrorType.AlreadyExists
            };
        }

        // ==========================================
        // Login Successful
        // ==========================================

        result.Data.PasswordHash = null;

        result.Message =
            "تم تسجيل الدخول بنجاح.";

        return result;
    }

    public static async Task<ApiResult<UserInfo>>
        GetUserByID(
            int userId,
            CancellationToken cancellationToken)
    {
        return await LoginData
            .GetUserByID(
                userId,
                cancellationToken);
    }
}