
using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Threading;
using System.Threading.Tasks;

using ConnectionString;

public static class WasteTypesData
{
public static async Task<ApiResult<List<WasteTypesViewDTO>>> GetAllWasteTypesAsync(
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<List<WasteTypesViewDTO>>();
    var list = new List<WasteTypesViewDTO>();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_GetAllWasteTypes", connection) { CommandType = CommandType.StoredProcedure };
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        using var reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
        while (reader.Read())
        {
            list.Add(new WasteTypesViewDTO
            {
                ID = reader.IsDBNull(reader.GetOrdinal("ID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ID")),
                NameAr = reader.IsDBNull(reader.GetOrdinal("NameAr")) ? null : reader.GetString(reader.GetOrdinal("NameAr")),
                IsActive = reader.IsDBNull(reader.GetOrdinal("IsActive")) ? false : reader.GetBoolean(reader.GetOrdinal("IsActive")),
                CreatedAt = reader.IsDBNull(reader.GetOrdinal("CreatedAt")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("CreatedAt"))
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

public static async Task<ApiResult<WasteTypesDTO>> AddWasteTypesAsync(
    WasteTypesDTO wastetypes,
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<WasteTypesDTO>();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_AddWasteTypes", connection) { CommandType = CommandType.StoredProcedure };
        command.Parameters.Add("@NameAr", SqlDbType.NVarChar, 50).Value = (object?)wastetypes.NameAr ?? DBNull.Value;
        var outputID = new SqlParameter("@NewID", SqlDbType.Int) { Direction = ParameterDirection.Output };
        var outputMsg = new SqlParameter("@Message", SqlDbType.NVarChar, 250) { Direction = ParameterDirection.Output };
        var outputErrorType = new SqlParameter("@ErrorType", SqlDbType.Int) { Direction = ParameterDirection.Output };
        command.Parameters.Add(outputID);
        command.Parameters.Add(outputMsg);
        command.Parameters.Add(outputErrorType);
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        await command.ExecuteNonQueryAsync(cancellationToken).ConfigureAwait(false);
        wastetypes.ID = (int)outputID.Value;
        result.Data = wastetypes;
        result.Message = outputMsg.Value?.ToString();
        result.ErrorType = ErrorTypeMapper.GetErrorType(Convert.ToInt32(outputErrorType.Value));
    }
    catch (Exception ex)
    {
        result.Data = null;
        result.Message = "Database error occurred while adding the wastetypes.";
        result.ErrorType = ErrorType.DatabaseError;
    }
    return result;
}

public static async Task<ApiResult<WasteTypesDTO>> UpdateWasteTypesByIDAsync(
    WasteTypesUpdateDTO wastetypes,
    CancellationToken cancellationToken = default)
{
WasteTypesDTO wastetypesDTO = new  WasteTypesDTO();
    var result = new ApiResult<WasteTypesDTO>();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_UpdateWasteTypesByID", connection) { CommandType = CommandType.StoredProcedure };
        command.Parameters.Add("@ID", SqlDbType.Int).Value = (object?)wastetypes.ID ?? DBNull.Value;
        command.Parameters.Add("@IsActive", SqlDbType.Bit).Value = (object?)wastetypes.IsActive ?? DBNull.Value;
        var outputMsg = new SqlParameter("@Message", SqlDbType.NVarChar, 250) { Direction = ParameterDirection.Output };
        var outputErrorType = new SqlParameter("@ErrorType", SqlDbType.Int) { Direction = ParameterDirection.Output };
        command.Parameters.Add(outputMsg);
        command.Parameters.Add(outputErrorType);
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        using var reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
        if (reader.Read())
        {
            wastetypesDTO.ID = reader.IsDBNull(reader.GetOrdinal("ID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ID"));
            wastetypesDTO.NameAr = reader.IsDBNull(reader.GetOrdinal("NameAr")) ? null : reader.GetString(reader.GetOrdinal("NameAr"));
        }
        reader.Close();
        result.Data = wastetypesDTO;
        result.Message = outputMsg.Value?.ToString();
        result.ErrorType = ErrorTypeMapper.GetErrorType(Convert.ToInt32(outputErrorType.Value));
    }
    catch (Exception ex)
    {
        result.Data = null;
        result.Message = "Database error occurred while updating the wastetypes";
        result.ErrorType = ErrorType.DatabaseError;
    }
    return result;
}

public static async Task<ApiResult<WasteTypesViewDTO>> GetWasteTypesByIDAsync(
    int ID,
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<WasteTypesViewDTO>();
    var dto = new WasteTypesViewDTO();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_GetWasteTypesByID", connection) { CommandType = CommandType.StoredProcedure };
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
            dto.NameAr = reader.IsDBNull(reader.GetOrdinal("NameAr")) ? null : reader.GetString(reader.GetOrdinal("NameAr"));
            dto.IsActive = reader.IsDBNull(reader.GetOrdinal("IsActive")) ? false : reader.GetBoolean(reader.GetOrdinal("IsActive"));
            dto.CreatedAt = reader.IsDBNull(reader.GetOrdinal("CreatedAt")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("CreatedAt"));
        }
        reader.Close();
        result.Data = dto;
        result.Message = messageParameter.Value?.ToString();
        result.ErrorType = ErrorTypeMapper.GetErrorType(Convert.ToInt32(errorTypeParameter.Value));
    }
    catch (Exception ex)
    {
        result.Data = null;
        result.Message = "Database error occurred while fetching the wastetypes";
        result.ErrorType = ErrorType.DatabaseError;
    }
    return result;
}

}

