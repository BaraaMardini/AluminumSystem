
using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Threading;
using System.Threading.Tasks;

using ConnectionString;

public static class ProductionStagesData
{
public static async Task<ApiResult<List<ProductionStagesViewDTO>>> GetAllProductionStagesAsync(
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<List<ProductionStagesViewDTO>>();
    var list = new List<ProductionStagesViewDTO>();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_GetAllProductionStages", connection) { CommandType = CommandType.StoredProcedure };
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        using var reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
        while (reader.Read())
        {
            list.Add(new ProductionStagesViewDTO
            {
                ID = reader.IsDBNull(reader.GetOrdinal("ID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ID")),
                StageName = reader.IsDBNull(reader.GetOrdinal("StageName")) ? null : reader.GetString(reader.GetOrdinal("StageName")),
                Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? null : reader.GetString(reader.GetOrdinal("Description")),
                DisplayOrder = reader.IsDBNull(reader.GetOrdinal("DisplayOrder")) ? 0 : reader.GetInt32(reader.GetOrdinal("DisplayOrder")),
                CreatedAt = reader.IsDBNull(reader.GetOrdinal("CreatedAt")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
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

public static async Task<ApiResult<ProductionStagesDTO>> AddProductionStagesAsync(
    ProductionStagesDTO productionstages,
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<ProductionStagesDTO>();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_AddProductionStages", connection) { CommandType = CommandType.StoredProcedure };
        command.Parameters.Add("@StageName", SqlDbType.NVarChar, 50).Value = (object?)productionstages.StageName ?? DBNull.Value;
        command.Parameters.Add("@Description", SqlDbType.NVarChar, 50).Value = (object?)productionstages.Description ?? DBNull.Value;
        command.Parameters.Add("@DisplayOrder", SqlDbType.Int).Value = productionstages.DisplayOrder;
        var outputID = new SqlParameter("@NewID", SqlDbType.Int) { Direction = ParameterDirection.Output };
        var outputMsg = new SqlParameter("@Message", SqlDbType.NVarChar, 250) { Direction = ParameterDirection.Output };
        var outputErrorType = new SqlParameter("@ErrorType", SqlDbType.Int) { Direction = ParameterDirection.Output };
        command.Parameters.Add(outputID);
        command.Parameters.Add(outputMsg);
        command.Parameters.Add(outputErrorType);
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        await command.ExecuteNonQueryAsync(cancellationToken).ConfigureAwait(false);
        productionstages.ID = (int)outputID.Value;
        result.Data = productionstages;
        result.Message = outputMsg.Value?.ToString();
        result.ErrorType = ErrorTypeMapper.GetErrorType(Convert.ToInt32(outputErrorType.Value));
    }
    catch (Exception ex)
    {
        result.Data = null;
        result.Message = "Database error occurred while adding the productionstages.";
        result.ErrorType = ErrorType.DatabaseError;
    }
    return result;
}

public static async Task<ApiResult<ProductionStagesDTO>> UpdateProductionStagesByIDAsync(
    ProductionStagesUpdateDTO productionstages,
    CancellationToken cancellationToken = default)
{
ProductionStagesDTO productionstagesDTO = new  ProductionStagesDTO();
    var result = new ApiResult<ProductionStagesDTO>();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_UpdateProductionStagesByID", connection) { CommandType = CommandType.StoredProcedure };
        command.Parameters.Add("@ID", SqlDbType.Int).Value = (object?)productionstages.ID ?? DBNull.Value;
        command.Parameters.Add("@Description", SqlDbType.NVarChar, 500).Value = (object?)productionstages.Description ?? DBNull.Value;
        command.Parameters.Add("@IsActive", SqlDbType.Bit).Value = (object?)productionstages.IsActive ?? DBNull.Value;
        var outputMsg = new SqlParameter("@Message", SqlDbType.NVarChar, 250) { Direction = ParameterDirection.Output };
        var outputErrorType = new SqlParameter("@ErrorType", SqlDbType.Int) { Direction = ParameterDirection.Output };
        command.Parameters.Add(outputMsg);
        command.Parameters.Add(outputErrorType);
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        using var reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
        if (reader.Read())
        {
            productionstagesDTO.ID = reader.IsDBNull(reader.GetOrdinal("ID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ID"));
            productionstagesDTO.StageName = reader.IsDBNull(reader.GetOrdinal("StageName")) ? null : reader.GetString(reader.GetOrdinal("StageName"));
            productionstagesDTO.Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? null : reader.GetString(reader.GetOrdinal("Description"));
            productionstagesDTO.DisplayOrder = reader.IsDBNull(reader.GetOrdinal("DisplayOrder")) ? 0 : reader.GetInt32(reader.GetOrdinal("DisplayOrder"));
        }
        reader.Close();
        result.Data = productionstagesDTO;
        result.Message = outputMsg.Value?.ToString();
        result.ErrorType = ErrorTypeMapper.GetErrorType(Convert.ToInt32(outputErrorType.Value));
    }
    catch (Exception ex)
    {
        result.Data = null;
        result.Message = "Database error occurred while updating the productionstages";
        result.ErrorType = ErrorType.DatabaseError;
    }
    return result;
}

public static async Task<ApiResult<ProductionStagesViewDTO>> GetProductionStagesByIDAsync(
    int ID,
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<ProductionStagesViewDTO>();
    var dto = new ProductionStagesViewDTO();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_GetProductionStagesByID", connection) { CommandType = CommandType.StoredProcedure };
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
            dto.StageName = reader.IsDBNull(reader.GetOrdinal("StageName")) ? null : reader.GetString(reader.GetOrdinal("StageName"));
            dto.Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? null : reader.GetString(reader.GetOrdinal("Description"));
            dto.DisplayOrder = reader.IsDBNull(reader.GetOrdinal("DisplayOrder")) ? 0 : reader.GetInt32(reader.GetOrdinal("DisplayOrder"));
            dto.CreatedAt = reader.IsDBNull(reader.GetOrdinal("CreatedAt")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("CreatedAt"));
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
        result.Message = "Database error occurred while fetching the productionstages";
        result.ErrorType = ErrorType.DatabaseError;
    }
    return result;
}

}

