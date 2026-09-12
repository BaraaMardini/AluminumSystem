
using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Threading;
using System.Threading.Tasks;

using ConnectionString;

public static class ProductionStageWastesData
{
public static async Task<ApiResult<List<ProductionStageWastesViewDTO>>> GetAllProductionStageWastesAsync(
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<List<ProductionStageWastesViewDTO>>();
    var list = new List<ProductionStageWastesViewDTO>();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_GetAllProductionStageWastes", connection) { CommandType = CommandType.StoredProcedure };
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        using var reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
        while (reader.Read())
        {
            list.Add(new ProductionStageWastesViewDTO
            {
                ID = reader.IsDBNull(reader.GetOrdinal("ID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ID")),
                StageEntryID = reader.IsDBNull(reader.GetOrdinal("StageEntryID")) ? 0 : reader.GetInt32(reader.GetOrdinal("StageEntryID")),
                StageName = reader.IsDBNull(reader.GetOrdinal("StageName")) ? null : reader.GetString(reader.GetOrdinal("StageName")),
                WasteQuantity = reader.IsDBNull(reader.GetOrdinal("WasteQuantity")) ? 0 : reader.GetInt32(reader.GetOrdinal("WasteQuantity")),
                CreatedBy = reader.IsDBNull(reader.GetOrdinal("CreatedBy")) ? null : reader.GetString(reader.GetOrdinal("CreatedBy")),
                WasteTypesName = reader.IsDBNull(reader.GetOrdinal("WasteTypesName")) ? null : reader.GetString(reader.GetOrdinal("WasteTypesName")),
                WasteReasonsName = reader.IsDBNull(reader.GetOrdinal("WasteReasonsName")) ? null : reader.GetString(reader.GetOrdinal("WasteReasonsName")),
                CreatedAt = reader.IsDBNull(reader.GetOrdinal("CreatedAt")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                Notes = reader.IsDBNull(reader.GetOrdinal("Notes")) ? null : reader.GetString(reader.GetOrdinal("Notes"))
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

public static async Task<ApiResult<ProductionStageWastesDTO>> AddProductionStageWastesAsync(
    ProductionStageWastesDTO productionstagewastes,
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<ProductionStageWastesDTO>();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_AddProductionStageWastes", connection) { CommandType = CommandType.StoredProcedure };
        command.Parameters.Add("@StageEntryID", SqlDbType.Int).Value = productionstagewastes.StageEntryID;
        command.Parameters.Add("@WasteQuantity", SqlDbType.Int).Value = productionstagewastes.WasteQuantity;
        command.Parameters.Add("@Email", SqlDbType.NVarChar, 50).Value = (object?)productionstagewastes.Email ?? DBNull.Value;
        command.Parameters.Add("@Notes", SqlDbType.NVarChar, 50).Value = (object?)productionstagewastes.Notes ?? DBNull.Value;
        command.Parameters.Add("@WasteTypeID", SqlDbType.Int).Value = productionstagewastes.WasteTypeID;
        command.Parameters.Add("@WasteReasonID", SqlDbType.Int).Value = productionstagewastes.WasteReasonID;
        var outputID = new SqlParameter("@NewID", SqlDbType.Int) { Direction = ParameterDirection.Output };
        var outputMsg = new SqlParameter("@Message", SqlDbType.NVarChar, 250) { Direction = ParameterDirection.Output };
        var outputErrorType = new SqlParameter("@ErrorType", SqlDbType.Int) { Direction = ParameterDirection.Output };
        command.Parameters.Add(outputID);
        command.Parameters.Add(outputMsg);
        command.Parameters.Add(outputErrorType);
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        await command.ExecuteNonQueryAsync(cancellationToken).ConfigureAwait(false);
        productionstagewastes.ID = (int)outputID.Value;
        result.Data = productionstagewastes;
        result.Message = outputMsg.Value?.ToString();
        result.ErrorType = ErrorTypeMapper.GetErrorType(Convert.ToInt32(outputErrorType.Value));
    }
    catch (Exception ex)
    {
        result.Data = null;
        result.Message = "Database error occurred while adding the productionstagewastes.";
        result.ErrorType = ErrorType.DatabaseError;
    }
    return result;
}

public static async Task<ApiResult<ProductionStageWastesDTO>> UpdateProductionStageWastesByIDAsync(
    ProductionStageWastesUpdateDTO productionstagewastes,
    CancellationToken cancellationToken = default)
{
ProductionStageWastesDTO productionstagewastesDTO = new  ProductionStageWastesDTO();
    var result = new ApiResult<ProductionStageWastesDTO>();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_UpdateProductionStageWastesByID", connection) { CommandType = CommandType.StoredProcedure };
        command.Parameters.Add("@ID", SqlDbType.Int).Value = (object?)productionstagewastes.ID ?? DBNull.Value;
        command.Parameters.Add("@Notes", SqlDbType.NVarChar, 500).Value = (object?)productionstagewastes.Notes ?? DBNull.Value;
        var outputMsg = new SqlParameter("@Message", SqlDbType.NVarChar, 250) { Direction = ParameterDirection.Output };
        var outputErrorType = new SqlParameter("@ErrorType", SqlDbType.Int) { Direction = ParameterDirection.Output };
        command.Parameters.Add(outputMsg);
        command.Parameters.Add(outputErrorType);
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        using var reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
        if (reader.Read())
        {
            productionstagewastesDTO.ID = reader.IsDBNull(reader.GetOrdinal("ID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ID"));
            productionstagewastesDTO.StageEntryID = reader.IsDBNull(reader.GetOrdinal("StageEntryID")) ? 0 : reader.GetInt32(reader.GetOrdinal("StageEntryID"));
            productionstagewastesDTO.WasteQuantity = reader.IsDBNull(reader.GetOrdinal("WasteQuantity")) ? 0 : reader.GetInt32(reader.GetOrdinal("WasteQuantity"));
            productionstagewastesDTO.Email = reader.IsDBNull(reader.GetOrdinal("Email")) ? null : reader.GetString(reader.GetOrdinal("Email"));
            productionstagewastesDTO.Notes = reader.IsDBNull(reader.GetOrdinal("Notes")) ? null : reader.GetString(reader.GetOrdinal("Notes"));
            productionstagewastesDTO.WasteTypeID = reader.IsDBNull(reader.GetOrdinal("WasteTypeID")) ? 0 : reader.GetInt32(reader.GetOrdinal("WasteTypeID"));
            productionstagewastesDTO.WasteReasonID = reader.IsDBNull(reader.GetOrdinal("WasteReasonID")) ? 0 : reader.GetInt32(reader.GetOrdinal("WasteReasonID"));
        }
        reader.Close();
        result.Data = productionstagewastesDTO;
        result.Message = outputMsg.Value?.ToString();
        result.ErrorType = ErrorTypeMapper.GetErrorType(Convert.ToInt32(outputErrorType.Value));
    }
    catch (Exception ex)
    {
        result.Data = null;
        result.Message = "Database error occurred while updating the productionstagewastes";
        result.ErrorType = ErrorType.DatabaseError;
    }
    return result;
}

public static async Task<ApiResult<ProductionStageWastesDTO>> DeleteProductionStageWastesByIDAsync(
    int iD,
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<ProductionStageWastesDTO>();
    var productionstagewastes = new ProductionStageWastesDTO
    {
        ID = iD,
    };
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_DeleteProductionStageWastesByID", connection) { CommandType = CommandType.StoredProcedure };
        command.Parameters.Add("@ID", SqlDbType.Int).Value = productionstagewastes.ID;
        var outputMsg = new SqlParameter("@Message", SqlDbType.NVarChar, 250) { Direction = ParameterDirection.Output };
        var outputErrorType = new SqlParameter("@ErrorType", SqlDbType.Int) { Direction = ParameterDirection.Output };
        command.Parameters.Add(outputMsg);
        command.Parameters.Add(outputErrorType);
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        await command.ExecuteNonQueryAsync(cancellationToken).ConfigureAwait(false);
        result.Data = productionstagewastes;
        result.Message = outputMsg.Value?.ToString();
        result.ErrorType = ErrorTypeMapper.GetErrorType(Convert.ToInt32(outputErrorType.Value));
    }
    catch (Exception ex)
    {
        result.Data = null;
        result.Message = "Database error occurred while deleting the productionstagewastes";
        result.ErrorType = ErrorType.DatabaseError;
    }
    return result;
}

public static async Task<ApiResult<List<ProductionStageWastesViewDTO>>> SearchProductionStageWastes(
int? OrderStageID,
string? StageName,
string? WasteTypesName,
string? WasteReasonsName,
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<List<ProductionStageWastesViewDTO>>();
    var list = new List<ProductionStageWastesViewDTO>();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_SearchProductionStageWastes", connection) { CommandType = CommandType.StoredProcedure };
        command.Parameters.Add("@OrderStageID", SqlDbType.Int).Value = OrderStageID ;
        command.Parameters.Add("@StageName", SqlDbType.NVarChar).Value = StageName ;
        command.Parameters.Add("@WasteTypesName", SqlDbType.NVarChar).Value = WasteTypesName ;
        command.Parameters.Add("@WasteReasonsName", SqlDbType.NVarChar).Value = WasteReasonsName ;
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        using var reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
        while (reader.Read())
        {
            list.Add(new ProductionStageWastesViewDTO
            {
                ID = reader.IsDBNull(reader.GetOrdinal("ID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ID")),
                StageEntryID = reader.IsDBNull(reader.GetOrdinal("StageEntryID")) ? 0 : reader.GetInt32(reader.GetOrdinal("StageEntryID")),
                StageName = reader.IsDBNull(reader.GetOrdinal("StageName")) ? null : reader.GetString(reader.GetOrdinal("StageName")),
                WasteQuantity = reader.IsDBNull(reader.GetOrdinal("WasteQuantity")) ? 0 : reader.GetInt32(reader.GetOrdinal("WasteQuantity")),
                CreatedBy = reader.IsDBNull(reader.GetOrdinal("CreatedBy")) ? null : reader.GetString(reader.GetOrdinal("CreatedBy")),
                WasteTypesName = reader.IsDBNull(reader.GetOrdinal("WasteTypesName")) ? null : reader.GetString(reader.GetOrdinal("WasteTypesName")),
                WasteReasonsName = reader.IsDBNull(reader.GetOrdinal("WasteReasonsName")) ? null : reader.GetString(reader.GetOrdinal("WasteReasonsName")),
                CreatedAt = reader.IsDBNull(reader.GetOrdinal("CreatedAt")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                Notes = reader.IsDBNull(reader.GetOrdinal("Notes")) ? null : reader.GetString(reader.GetOrdinal("Notes"))
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

public static async Task<ApiResult<ProductionStageWastesViewDTO>> GetProductionStageWastesByIDAsync(
    int ID,
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<ProductionStageWastesViewDTO>();
    var dto = new ProductionStageWastesViewDTO();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_GetProductionStageWastesByID", connection) { CommandType = CommandType.StoredProcedure };
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
            dto.StageEntryID = reader.IsDBNull(reader.GetOrdinal("StageEntryID")) ? 0 : reader.GetInt32(reader.GetOrdinal("StageEntryID"));
            dto.StageName = reader.IsDBNull(reader.GetOrdinal("StageName")) ? null : reader.GetString(reader.GetOrdinal("StageName"));
            dto.WasteQuantity = reader.IsDBNull(reader.GetOrdinal("WasteQuantity")) ? 0 : reader.GetInt32(reader.GetOrdinal("WasteQuantity"));
            dto.CreatedBy = reader.IsDBNull(reader.GetOrdinal("CreatedBy")) ? null : reader.GetString(reader.GetOrdinal("CreatedBy"));
            dto.WasteTypesName = reader.IsDBNull(reader.GetOrdinal("WasteTypesName")) ? null : reader.GetString(reader.GetOrdinal("WasteTypesName"));
            dto.WasteReasonsName = reader.IsDBNull(reader.GetOrdinal("WasteReasonsName")) ? null : reader.GetString(reader.GetOrdinal("WasteReasonsName"));
            dto.CreatedAt = reader.IsDBNull(reader.GetOrdinal("CreatedAt")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("CreatedAt"));
            dto.Notes = reader.IsDBNull(reader.GetOrdinal("Notes")) ? null : reader.GetString(reader.GetOrdinal("Notes"));
        }
        reader.Close();
        result.Data = dto;
        result.Message = messageParameter.Value?.ToString();
        result.ErrorType = ErrorTypeMapper.GetErrorType(Convert.ToInt32(errorTypeParameter.Value));
    }
    catch (Exception ex)
    {
        result.Data = null;
        result.Message = "Database error occurred while fetching the productionstagewastes";
        result.ErrorType = ErrorType.DatabaseError;
    }
    return result;
}

}

