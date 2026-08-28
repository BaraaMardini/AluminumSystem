
using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Threading;
using System.Threading.Tasks;

using ConnectionString;

public static class StatusesData
{
public static async Task<ApiResult<List<StatusesViewDTO>>> GetAllStatusesAsync(
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<List<StatusesViewDTO>>();
    var list = new List<StatusesViewDTO>();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_GetAllStatuses", connection) { CommandType = CommandType.StoredProcedure };
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        using var reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
        while (reader.Read())
        {
            list.Add(new StatusesViewDTO
            {
                ID = reader.IsDBNull(reader.GetOrdinal("ID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ID")),
                StatusName = reader.IsDBNull(reader.GetOrdinal("StatusName")) ? null : reader.GetString(reader.GetOrdinal("StatusName")),
                Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? null : reader.GetString(reader.GetOrdinal("Description")),
                CreatedAt = reader.IsDBNull(reader.GetOrdinal("CreatedAt")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                UpdatedAt = reader.IsDBNull(reader.GetOrdinal("UpdatedAt")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("UpdatedAt")),
                IsActive = reader.IsDBNull(reader.GetOrdinal("IsActive")) ? false : reader.GetBoolean(reader.GetOrdinal("IsActive"))
            });
        }
        result.Data = list;
    }
    catch (Exception ex)
    {
        result.Data = null;
        result.Message = "Database error occurred while fetching data.";
        result.ErrorType = ErrorType.DatabaseError;
    }
    return result;
}

public static async Task<ApiResult<StatusesDTO>> AddStatusesAsync(
    StatusesDTO statuses,
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<StatusesDTO>();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_AddStatuses", connection) { CommandType = CommandType.StoredProcedure };
        command.Parameters.Add("@StatusName", SqlDbType.NVarChar, 50).Value = (object?)statuses.StatusName ?? DBNull.Value;
        command.Parameters.Add("@Description", SqlDbType.NVarChar, 50).Value = (object?)statuses.Description ?? DBNull.Value;
        var outputID = new SqlParameter("@NewID", SqlDbType.Int) { Direction = ParameterDirection.Output };
        var outputMsg = new SqlParameter("@Message", SqlDbType.NVarChar, 250) { Direction = ParameterDirection.Output };
        var outputErrorType = new SqlParameter("@ErrorType", SqlDbType.Int) { Direction = ParameterDirection.Output };
        command.Parameters.Add(outputID);
        command.Parameters.Add(outputMsg);
        command.Parameters.Add(outputErrorType);
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        await command.ExecuteNonQueryAsync(cancellationToken).ConfigureAwait(false);
        statuses.ID = (int)outputID.Value;
        result.Data = statuses;
        result.Message = outputMsg.Value?.ToString();
        result.ErrorType = ErrorTypeMapper.GetErrorType(Convert.ToInt32(outputErrorType.Value));
    }
    catch (Exception ex)
    {
        result.Data = null;
        result.Message = "Database error occurred while adding the statuses.";
        result.ErrorType = ErrorType.DatabaseError;
    }
    return result;
}

public static async Task<ApiResult<StatusesDTO>> UpdateStatusesByIDAsync(
    StatusesUpdateDTO statuses,
    CancellationToken cancellationToken = default)
{
StatusesDTO statusesDTO = new  StatusesDTO();
    var result = new ApiResult<StatusesDTO>();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_UpdateStatusesByID", connection) { CommandType = CommandType.StoredProcedure };
        command.Parameters.Add("@ID", SqlDbType.Int).Value = (object?)statuses.ID ?? DBNull.Value;
        command.Parameters.Add("@Description", SqlDbType.NVarChar, 500).Value = (object?)statuses.Description ?? DBNull.Value;
        command.Parameters.Add("@IsActive", SqlDbType.Bit).Value = (object?)statuses.IsActive ?? DBNull.Value;
        var outputMsg = new SqlParameter("@Message", SqlDbType.NVarChar, 250) { Direction = ParameterDirection.Output };
        var outputErrorType = new SqlParameter("@ErrorType", SqlDbType.Int) { Direction = ParameterDirection.Output };
        command.Parameters.Add(outputMsg);
        command.Parameters.Add(outputErrorType);
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        using var reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
        if (reader.Read())
        {
            statusesDTO.ID = reader.IsDBNull(reader.GetOrdinal("ID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ID"));
            statusesDTO.StatusName = reader.IsDBNull(reader.GetOrdinal("StatusName")) ? null : reader.GetString(reader.GetOrdinal("StatusName"));
            statusesDTO.Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? null : reader.GetString(reader.GetOrdinal("Description"));
        }
        reader.Close();
        result.Data = statusesDTO;
        result.Message = outputMsg.Value?.ToString();
        result.ErrorType = ErrorTypeMapper.GetErrorType(Convert.ToInt32(outputErrorType.Value));
    }
    catch (Exception ex)
    {
        result.Data = null;
        result.Message = "Database error occurred while updating the statuses";
        result.ErrorType = ErrorType.DatabaseError;
    }
    return result;
}

public static async Task<ApiResult<StatusesViewDTO>> GetStatusesByIDAsync(
    int ID,
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<StatusesViewDTO>();
    var dto = new StatusesViewDTO();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_GetStatusesByID", connection) { CommandType = CommandType.StoredProcedure };
        command.Parameters.Add("@ID", SqlDbType.Int).Value = ID;
        var messageParameter = new SqlParameter("@Message", SqlDbType.NVarChar, 250) { Direction = ParameterDirection.Output };
        var errorTypeParameter = new SqlParameter("@ErrorType", SqlDbType.Int) { Direction = ParameterDirection.Output };
        command.Parameters.Add(messageParameter);
        command.Parameters.Add(errorTypeParameter);
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        using var reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
        if (reader.Read())
        {
            dto.ID = reader.IsDBNull(reader.GetOrdinal("ID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ID"));
            dto.StatusName = reader.IsDBNull(reader.GetOrdinal("StatusName")) ? null : reader.GetString(reader.GetOrdinal("StatusName"));
            dto.Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? null : reader.GetString(reader.GetOrdinal("Description"));
            dto.CreatedAt = reader.IsDBNull(reader.GetOrdinal("CreatedAt")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("CreatedAt"));
            dto.UpdatedAt = reader.IsDBNull(reader.GetOrdinal("UpdatedAt")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("UpdatedAt"));
            dto.IsActive = reader.IsDBNull(reader.GetOrdinal("IsActive")) ? false : reader.GetBoolean(reader.GetOrdinal("IsActive"));
        }
        reader.Close();
        result.Data = dto;
        result.Message = messageParameter.Value?.ToString();
        result.ErrorType = ErrorTypeMapper.GetErrorType(Convert.ToInt32(errorTypeParameter.Value));
    }
    catch (Exception ex)
    {
        result.Data = null;
        result.Message = "Database error occurred while fetching the statuses";
        result.ErrorType = ErrorType.DatabaseError;
    }
    return result;
}

}

