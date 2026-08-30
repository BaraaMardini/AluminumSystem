using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;

using ConnectionString;

public static class UsersData
{
    // =====================================================
    // GET ALL USERS
    // =====================================================

    public static async Task<ApiResult<List<UsersViewDTO>>> GetAllUsersAsync(
        CancellationToken cancellationToken = default)
    {
        var result =
            new ApiResult<List<UsersViewDTO>>();

        var list =
            new List<UsersViewDTO>();

        try
        {
            await using var connection =
                new SqlConnection(
                    connectionString._connectionString);

            await using var command =
                new SqlCommand(
                    "SP_GetAllUsers",
                    connection)
                {
                    CommandType =
                        CommandType.StoredProcedure
                };

            await connection.OpenAsync(
                cancellationToken)
                .ConfigureAwait(false);

            using var reader =
                await command.ExecuteReaderAsync(
                    cancellationToken)
                    .ConfigureAwait(false);

            while (reader.Read())
            {
                list.Add(new UsersViewDTO
                {
                    ID =
                        reader.IsDBNull(
                            reader.GetOrdinal("ID"))
                        ? 0
                        : reader.GetInt32(
                            reader.GetOrdinal("ID")),

                    UserName =
                        reader.IsDBNull(
                            reader.GetOrdinal("UserName"))
                        ? null
                        : reader.GetString(
                            reader.GetOrdinal("UserName")),

                    Email =
                        reader.IsDBNull(
                            reader.GetOrdinal("Email"))
                        ? null
                        : reader.GetString(
                            reader.GetOrdinal("Email")),

                    FullName =
                        reader.IsDBNull(
                            reader.GetOrdinal("FullName"))
                        ? null
                        : reader.GetString(
                            reader.GetOrdinal("FullName")),

                    CreatedAt =
                        reader.IsDBNull(
                            reader.GetOrdinal("CreatedAt"))
                        ? DateTime.MinValue
                        : reader.GetDateTime(
                            reader.GetOrdinal("CreatedAt")),

                    UpdatedAt =
                        reader.IsDBNull(
                            reader.GetOrdinal("UpdatedAt"))
                        ? DateTime.MinValue
                        : reader.GetDateTime(
                            reader.GetOrdinal("UpdatedAt")),

                    RoleName =
                        reader.IsDBNull(
                            reader.GetOrdinal("RoleName"))
                        ? null
                        : reader.GetString(
                            reader.GetOrdinal("RoleName")),

                    IsActive =
                        reader.IsDBNull(
                            reader.GetOrdinal("IsActive"))
                        ? false
                        : reader.GetBoolean(
                            reader.GetOrdinal("IsActive"))
                });
            }

            result.Data = list;
        }
        catch (Exception ex)
        {
            result.Data = null;

            result.Message =
                "Database error occurred while fetching data.";

            result.ErrorType =
                ErrorType.DatabaseError;
        }

        return result;
    }


    // =====================================================
    // ADD USER
    // =====================================================

    public static async Task<ApiResult<UsersDTO>> AddUsersAsync(
        UsersDTO users,
        CancellationToken cancellationToken = default)
    {
        var result =
            new ApiResult<UsersDTO>();

        try
        {
            DataTable table =
                new DataTable();

            table.Columns.Add(
                "PermissionID",
                typeof(int));

            foreach (var item in users.Permissions
                         ?? Enumerable.Empty<Permissions>())
            {
                table.Rows.Add(
                    item.PermissionID);
            }

            await using var connection =
                new SqlConnection(
                    connectionString._connectionString);

            await using var command =
                new SqlCommand(
                    "SP_AddUsers",
                    connection)
                {
                    CommandType =
                        CommandType.StoredProcedure
                };

            command.Parameters.Add(
                "@UserName",
                SqlDbType.NVarChar,
                -1)
                .Value =
                    (object?)users.UserName
                    ?? DBNull.Value;

            command.Parameters.Add(
                "@PasswordHash",
                SqlDbType.NVarChar,
                -1)
                .Value =
                    (object?)users.Password
                    ?? DBNull.Value;

            command.Parameters.Add(
                "@Email",
                SqlDbType.NVarChar,
                -1)
                .Value =
                    (object?)users.Email
                    ?? DBNull.Value;

            command.Parameters.Add(
                "@FullName",
                SqlDbType.NVarChar,
                -1)
                .Value =
                    (object?)users.FullName
                    ?? DBNull.Value;

            command.Parameters.Add(
                "@RoleID",
                SqlDbType.Int)
                .Value =
                    users.RoleID;

            var itemsParameter =
                command.Parameters.Add(
                    "@Items",
                    SqlDbType.Structured);

            itemsParameter.TypeName =
                "dbo.PermissionTableType";

            itemsParameter.Value =
                table;

            var outputID =
                new SqlParameter(
                    "@NewID",
                    SqlDbType.Int)
                {
                    Direction =
                        ParameterDirection.Output
                };

            var outputMsg =
                new SqlParameter(
                    "@Message",
                    SqlDbType.NVarChar,
                    250)
                {
                    Direction =
                        ParameterDirection.Output
                };

            var outputErrorType =
                new SqlParameter(
                    "@ErrorType",
                    SqlDbType.Int)
                {
                    Direction =
                        ParameterDirection.Output
                };

            command.Parameters.Add(outputID);
            command.Parameters.Add(outputMsg);
            command.Parameters.Add(outputErrorType);

            await connection.OpenAsync(
                cancellationToken);

            await command.ExecuteNonQueryAsync(
                cancellationToken);

            int errorCode =
                Convert.ToInt32(
                    outputErrorType.Value);

            result.Message =
                outputMsg.Value?.ToString();

            result.ErrorType =
                ErrorTypeMapper.GetErrorType(
                    errorCode);

            if (errorCode == 0)
            {
                users.ID =
                    Convert.ToInt32(
                        outputID.Value);

                result.Data =
                    users;
            }
            else
            {
                result.Data = null;
            }
        }
        catch (Exception ex)
        {
            result.Data = null;

            result.Message =
                ex.Message;

            result.ErrorType =
                ErrorType.DatabaseError;
        }

        return result;
    }


    // =====================================================
    // UPDATE PASSWORD
    // =====================================================
    public static async Task<ApiResult<object>> UpdateUserPasswordAsync(
    string email,
    string oldPassword,
    string newPasswordHash,
    CancellationToken cancellationToken = default)
    {
        var result =
            new ApiResult<object>();

        try
        {
            // =================================================
            // 1. Get Old Password Hash
            // =================================================

            string oldPasswordHash = null;

            await using (
                var connection =
                    new SqlConnection(
                        connectionString._connectionString))
            {
                await using var command =
                    new SqlCommand(
                        "SP_GetUserPasswordByEmail",
                        connection)
                    {
                        CommandType =
                            CommandType.StoredProcedure
                    };

                command.Parameters.Add(
                    "@Email",
                    SqlDbType.NVarChar,
                    500)
                    .Value =
                        email;

                var passwordHashParameter =
                    new SqlParameter(
                        "@PasswordHash",
                        SqlDbType.NVarChar,
                        500)
                    {
                        Direction =
                            ParameterDirection.Output
                    };

                var messageParameter =
                    new SqlParameter(
                        "@Message",
                        SqlDbType.NVarChar,
                        250)
                    {
                        Direction =
                            ParameterDirection.Output
                    };

                var errorTypeParameter =
                    new SqlParameter(
                        "@ErrorType",
                        SqlDbType.Int)
                    {
                        Direction =
                            ParameterDirection.Output
                    };

                command.Parameters.Add(
                    passwordHashParameter);

                command.Parameters.Add(
                    messageParameter);

                command.Parameters.Add(
                    errorTypeParameter);

                await connection.OpenAsync(
                    cancellationToken)
                    .ConfigureAwait(false);

                await command.ExecuteNonQueryAsync(
                    cancellationToken)
                    .ConfigureAwait(false);

                int errorCode =
                    Convert.ToInt32(
                        errorTypeParameter.Value);

                if (errorCode != 0)
                {
                    result.Data = null;

                    result.Message =
                        messageParameter.Value?.ToString();

                    result.ErrorType =
                        ErrorTypeMapper.GetErrorType(
                            errorCode);

                    return result;
                }

                oldPasswordHash =
                    passwordHashParameter.Value?.ToString();
            }


            // =================================================
            // 2. Verify Old Password
            // =================================================

            bool passwordCorrect =
                BCrypt.Net.BCrypt.Verify(
                    oldPassword,
                    oldPasswordHash);

            if (!passwordCorrect)
            {
                result.Data = null;

                result.Message =
                    "كلمة المرور القديمة غير صحيحة.";

                result.ErrorType =
                    ErrorType.InvalidId;

                return result;
            }


            // =================================================
            // 3. Update New Password
            // =================================================

            await using (
                var connection =
                    new SqlConnection(
                        connectionString._connectionString))
            {
                await using var command =
                    new SqlCommand(
                        "SP_UpdateUserPassword",
                        connection)
                    {
                        CommandType =
                            CommandType.StoredProcedure
                    };

                command.Parameters.Add(
                    "@Email",
                    SqlDbType.NVarChar,
                    500)
                    .Value =
                        email;

                command.Parameters.Add(
                    "@NewPasswordHash",
                    SqlDbType.NVarChar,
                    500)
                    .Value =
                        newPasswordHash;

                var outputMsg =
                    new SqlParameter(
                        "@Message",
                        SqlDbType.NVarChar,
                        250)
                    {
                        Direction =
                            ParameterDirection.Output
                    };

                var outputErrorType =
                    new SqlParameter(
                        "@ErrorType",
                        SqlDbType.Int)
                    {
                        Direction =
                            ParameterDirection.Output
                    };

                command.Parameters.Add(
                    outputMsg);

                command.Parameters.Add(
                    outputErrorType);

                await connection.OpenAsync(
                    cancellationToken)
                    .ConfigureAwait(false);

                await command.ExecuteNonQueryAsync(
                    cancellationToken)
                    .ConfigureAwait(false);

                int errorCode =
                    Convert.ToInt32(
                        outputErrorType.Value);

                result.Message =
                    outputMsg.Value?.ToString();

                result.ErrorType =
                    ErrorTypeMapper.GetErrorType(
                        errorCode);

                result.Data = null;
            }
        }
        catch (Exception ex)
        {
            result.Data = null;

            result.Message =
                "حدث خطأ في قاعدة البيانات أثناء تحديث كلمة المرور.";

            result.ErrorType =
                ErrorType.DatabaseError;
        }

        return result;
    }
    // =====================================================
    // SEARCH USERS
    // =====================================================

    public static async Task<ApiResult<List<UsersViewDTO>>> SearchUsers(
        int? ID,
        string? UserName,
        bool? IsActive,
        CancellationToken cancellationToken = default)
    {
        var result =
            new ApiResult<List<UsersViewDTO>>();

        var list =
            new List<UsersViewDTO>();

        try
        {
            await using var connection =
                new SqlConnection(
                    connectionString._connectionString);

            await using var command =
                new SqlCommand(
                    "SP_SearchUsers",
                    connection)
                {
                    CommandType =
                        CommandType.StoredProcedure
                };

            command.Parameters.Add(
                "@ID",
                SqlDbType.Int)
                .Value =
                    ID.HasValue
                    ? ID.Value
                    : DBNull.Value;

            command.Parameters.Add(
                "@UserName",
                SqlDbType.NVarChar)
                .Value =
                    (object?)UserName
                    ?? DBNull.Value;

            command.Parameters.Add(
                "@IsActive",
                SqlDbType.Bit)
                .Value =
                    IsActive.HasValue
                    ? IsActive.Value
                    : DBNull.Value;

            await connection.OpenAsync(
                cancellationToken)
                .ConfigureAwait(false);

            using var reader =
                await command.ExecuteReaderAsync(
                    cancellationToken)
                    .ConfigureAwait(false);

            while (reader.Read())
            {
                list.Add(new UsersViewDTO
                {
                    ID =
                        reader.IsDBNull(
                            reader.GetOrdinal("ID"))
                        ? 0
                        : reader.GetInt32(
                            reader.GetOrdinal("ID")),

                    UserName =
                        reader.IsDBNull(
                            reader.GetOrdinal("UserName"))
                        ? null
                        : reader.GetString(
                            reader.GetOrdinal("UserName")),

                    Email =
                        reader.IsDBNull(
                            reader.GetOrdinal("Email"))
                        ? null
                        : reader.GetString(
                            reader.GetOrdinal("Email")),

                    FullName =
                        reader.IsDBNull(
                            reader.GetOrdinal("FullName"))
                        ? null
                        : reader.GetString(
                            reader.GetOrdinal("FullName")),

                    CreatedAt =
                        reader.IsDBNull(
                            reader.GetOrdinal("CreatedAt"))
                        ? DateTime.MinValue
                        : reader.GetDateTime(
                            reader.GetOrdinal("CreatedAt")),

                    UpdatedAt =
                        reader.IsDBNull(
                            reader.GetOrdinal("UpdatedAt"))
                        ? DateTime.MinValue
                        : reader.GetDateTime(
                            reader.GetOrdinal("UpdatedAt")),

                    RoleName =
                        reader.IsDBNull(
                            reader.GetOrdinal("RoleName"))
                        ? null
                        : reader.GetString(
                            reader.GetOrdinal("RoleName")),

                    IsActive =
                        reader.IsDBNull(
                            reader.GetOrdinal("IsActive"))
                        ? false
                        : reader.GetBoolean(
                            reader.GetOrdinal("IsActive"))
                });
            }

            result.Data =
                list;
        }
        catch (Exception ex)
        {
            result.Data = null;

            result.Message =
                "Database error occurred while fetching data.";

            result.ErrorType =
                ErrorType.DatabaseError;
        }

        return result;
    }


    // =====================================================
    // GET USER BY ID
    // =====================================================

    public static async Task<ApiResult<UsersViewDTO>> GetUsersByIDAsync(
        int ID,
        CancellationToken cancellationToken = default)
    {
        var result =
            new ApiResult<UsersViewDTO>();

        var dto =
            new UsersViewDTO();

        try
        {
            await using var connection =
                new SqlConnection(
                    connectionString._connectionString);

            await using var command =
                new SqlCommand(
                    "SP_GetUsersByID",
                    connection)
                {
                    CommandType =
                        CommandType.StoredProcedure
                };

            command.Parameters.Add(
                "@ID",
                SqlDbType.Int)
                .Value =
                    ID;

            var messageParameter =
                new SqlParameter(
                    "@Message",
                    SqlDbType.NVarChar,
                    250)
                {
                    Direction =
                        ParameterDirection.Output
                };

            var errorTypeParameter =
                new SqlParameter(
                    "@ErrorType",
                    SqlDbType.Int)
                {
                    Direction =
                        ParameterDirection.Output
                };

            command.Parameters.Add(
                messageParameter);

            command.Parameters.Add(
                errorTypeParameter);

            await connection.OpenAsync(
                cancellationToken)
                .ConfigureAwait(false);

            using var reader =
                await command.ExecuteReaderAsync(
                    cancellationToken)
                    .ConfigureAwait(false);

            if (reader.Read())
            {
                dto.ID =
                    reader.IsDBNull(
                        reader.GetOrdinal("ID"))
                    ? 0
                    : reader.GetInt32(
                        reader.GetOrdinal("ID"));

                dto.UserName =
                    reader.IsDBNull(
                        reader.GetOrdinal("UserName"))
                    ? null
                    : reader.GetString(
                        reader.GetOrdinal("UserName"));

                dto.Email =
                    reader.IsDBNull(
                        reader.GetOrdinal("Email"))
                    ? null
                    : reader.GetString(
                        reader.GetOrdinal("Email"));

                dto.FullName =
                    reader.IsDBNull(
                        reader.GetOrdinal("FullName"))
                    ? null
                    : reader.GetString(
                        reader.GetOrdinal("FullName"));

                dto.CreatedAt =
                    reader.IsDBNull(
                        reader.GetOrdinal("CreatedAt"))
                    ? DateTime.MinValue
                    : reader.GetDateTime(
                        reader.GetOrdinal("CreatedAt"));

                dto.UpdatedAt =
                    reader.IsDBNull(
                        reader.GetOrdinal("UpdatedAt"))
                    ? DateTime.MinValue
                    : reader.GetDateTime(
                        reader.GetOrdinal("UpdatedAt"));

                dto.RoleName =
                    reader.IsDBNull(
                        reader.GetOrdinal("RoleName"))
                    ? null
                    : reader.GetString(
                        reader.GetOrdinal("RoleName"));

                dto.IsActive =
                    reader.IsDBNull(
                        reader.GetOrdinal("IsActive"))
                    ? false
                    : reader.GetBoolean(
                        reader.GetOrdinal("IsActive"));
            }

            reader.Close();

            result.Data =
                dto;

            result.Message =
                messageParameter.Value?.ToString();

            result.ErrorType =
                ErrorTypeMapper.GetErrorType(
                    Convert.ToInt32(
                        errorTypeParameter.Value));
        }
        catch (Exception ex)
        {
            result.Data = null;

            result.Message =
                "Database error occurred while fetching the users";

            result.ErrorType =
                ErrorType.DatabaseError;
        }

        return result;
    }
}