
using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Threading;
using System.Threading.Tasks;

using ConnectionString;

public static class ProductionStageEntriesData
{
public static async Task<ApiResult<List<ProductionStageEntriesViewDTO>>> GetAllProductionStageEntriesAsync(
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<List<ProductionStageEntriesViewDTO>>();
    var list = new List<ProductionStageEntriesViewDTO>();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_GetAllProductionStageEntries", connection) { CommandType = CommandType.StoredProcedure };
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        using var reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
        while (reader.Read())
        {
            list.Add(new ProductionStageEntriesViewDTO
            {
                ID = reader.IsDBNull(reader.GetOrdinal("ID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ID")),
                OrderID = reader.IsDBNull(reader.GetOrdinal("OrderID")) ? 0 : reader.GetInt32(reader.GetOrdinal("OrderID")),
                OrderStageID = reader.IsDBNull(reader.GetOrdinal("OrderStageID")) ? 0 : reader.GetInt32(reader.GetOrdinal("OrderStageID")),
                Quantity = reader.IsDBNull(reader.GetOrdinal("Quantity")) ? 0 : reader.GetInt32(reader.GetOrdinal("Quantity")),
                CreatedAt = reader.IsDBNull(reader.GetOrdinal("CreatedAt")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                Notes = reader.IsDBNull(reader.GetOrdinal("Notes")) ? null : reader.GetString(reader.GetOrdinal("Notes")),
                UserName = reader.IsDBNull(reader.GetOrdinal("UserName")) ? null : reader.GetString(reader.GetOrdinal("UserName"))
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

public static async Task<ApiResult<ProductionStageEntriesDTO>> AddProductionStageEntriesAsync(
    ProductionStageEntriesDTO productionstageentries,
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<ProductionStageEntriesDTO>();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_AddProductionStageEntries", connection) { CommandType = CommandType.StoredProcedure };
        command.Parameters.Add("@OrderStageID", SqlDbType.Int).Value = productionstageentries.OrderStageID;
        command.Parameters.Add("@Quantity", SqlDbType.Int).Value = productionstageentries.Quantity;
        command.Parameters.Add("@Email", SqlDbType.NVarChar, 50).Value = (object?)productionstageentries.Email ?? DBNull.Value;
        command.Parameters.Add("@Notes", SqlDbType.NVarChar, 50).Value = (object?)productionstageentries.Notes ?? DBNull.Value;
        var outputID = new SqlParameter("@NewID", SqlDbType.Int) { Direction = ParameterDirection.Output };
        var outputMsg = new SqlParameter("@Message", SqlDbType.NVarChar, 250) { Direction = ParameterDirection.Output };
        var outputErrorType = new SqlParameter("@ErrorType", SqlDbType.Int) { Direction = ParameterDirection.Output };
        command.Parameters.Add(outputID);
        command.Parameters.Add(outputMsg);
        command.Parameters.Add(outputErrorType);
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        await command.ExecuteNonQueryAsync(cancellationToken).ConfigureAwait(false);
        productionstageentries.ID = (int)outputID.Value;
        result.Data = productionstageentries;
        result.Message = outputMsg.Value?.ToString();
        result.ErrorType = ErrorTypeMapper.GetErrorType(Convert.ToInt32(outputErrorType.Value));
    }
    catch (Exception ex)
    {
        result.Data = null;
        result.Message = "Database error occurred while adding the productionstageentries.";
        result.ErrorType = ErrorType.DatabaseError;
    }
    return result;
}

public static async Task<ApiResult<ProductionStageEntriesDTO>> UpdateProductionStageEntriesByIDAsync(
    ProductionStageEntriesUpdateDTO productionstageentries,
    CancellationToken cancellationToken = default)
{
ProductionStageEntriesDTO productionstageentriesDTO = new  ProductionStageEntriesDTO();
    var result = new ApiResult<ProductionStageEntriesDTO>();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_UpdateProductionStageEntriesByID", connection) { CommandType = CommandType.StoredProcedure };
        command.Parameters.Add("@ID", SqlDbType.Int).Value = (object?)productionstageentries.ID ?? DBNull.Value;
        command.Parameters.Add("@Notes", SqlDbType.NVarChar, 500).Value = (object?)productionstageentries.Notes ?? DBNull.Value;
        var outputMsg = new SqlParameter("@Message", SqlDbType.NVarChar, 250) { Direction = ParameterDirection.Output };
        var outputErrorType = new SqlParameter("@ErrorType", SqlDbType.Int) { Direction = ParameterDirection.Output };
        command.Parameters.Add(outputMsg);
        command.Parameters.Add(outputErrorType);
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        using var reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
        if (reader.Read())
        {
            productionstageentriesDTO.ID = reader.IsDBNull(reader.GetOrdinal("ID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ID"));
            productionstageentriesDTO.OrderStageID = reader.IsDBNull(reader.GetOrdinal("OrderStageID")) ? 0 : reader.GetInt32(reader.GetOrdinal("OrderStageID"));
            productionstageentriesDTO.Quantity = reader.IsDBNull(reader.GetOrdinal("Quantity")) ? 0 : reader.GetInt32(reader.GetOrdinal("Quantity"));
            productionstageentriesDTO.Email = reader.IsDBNull(reader.GetOrdinal("Email")) ? null : reader.GetString(reader.GetOrdinal("Email"));
            productionstageentriesDTO.Notes = reader.IsDBNull(reader.GetOrdinal("Notes")) ? null : reader.GetString(reader.GetOrdinal("Notes"));
        }
        reader.Close();
        result.Data = productionstageentriesDTO;
        result.Message = outputMsg.Value?.ToString();
        result.ErrorType = ErrorTypeMapper.GetErrorType(Convert.ToInt32(outputErrorType.Value));
    }
    catch (Exception ex)
    {
        result.Data = null;
        result.Message = "Database error occurred while updating the productionstageentries";
        result.ErrorType = ErrorType.DatabaseError;
    }
    return result;
}

public static async Task<ApiResult<ProductionStageEntriesDTO>> DeleteProductionStageEntriesByIDAsync(
    int iD,
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<ProductionStageEntriesDTO>();
    var productionstageentries = new ProductionStageEntriesDTO
    {
        ID = iD,
    };
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_DeleteProductionStageEntriesByID", connection) { CommandType = CommandType.StoredProcedure };
        command.Parameters.Add("@ID", SqlDbType.Int).Value = productionstageentries.ID;
        var outputMsg = new SqlParameter("@Message", SqlDbType.NVarChar, 250) { Direction = ParameterDirection.Output };
        var outputErrorType = new SqlParameter("@ErrorType", SqlDbType.Int) { Direction = ParameterDirection.Output };
        command.Parameters.Add(outputMsg);
        command.Parameters.Add(outputErrorType);
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        await command.ExecuteNonQueryAsync(cancellationToken).ConfigureAwait(false);
        result.Data = productionstageentries;
        result.Message = outputMsg.Value?.ToString();
        result.ErrorType = ErrorTypeMapper.GetErrorType(Convert.ToInt32(outputErrorType.Value));
    }
    catch (Exception ex)
    {
        result.Data = null;
        result.Message = "Database error occurred while deleting the productionstageentries";
        result.ErrorType = ErrorType.DatabaseError;
    }
    return result;
}

public static async Task<ApiResult<List<ProductionStageEntriesViewDTO>>> SearchProductionStageEntries(
int? OrderID,
int? OrderStageID,
int? StageID,
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<List<ProductionStageEntriesViewDTO>>();
    var list = new List<ProductionStageEntriesViewDTO>();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_SearchProductionStageEntries", connection) { CommandType = CommandType.StoredProcedure };
        command.Parameters.Add("@OrderID", SqlDbType.Int).Value = OrderID ;
        command.Parameters.Add("@OrderStageID", SqlDbType.Int).Value = OrderStageID ;
        command.Parameters.Add("@StageID", SqlDbType.Int).Value = StageID ;
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        using var reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
        while (reader.Read())
        {
            list.Add(new ProductionStageEntriesViewDTO
            {
                ID = reader.IsDBNull(reader.GetOrdinal("ID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ID")),
                OrderID = reader.IsDBNull(reader.GetOrdinal("OrderID")) ? 0 : reader.GetInt32(reader.GetOrdinal("OrderID")),
                OrderStageID = reader.IsDBNull(reader.GetOrdinal("OrderStageID")) ? 0 : reader.GetInt32(reader.GetOrdinal("OrderStageID")),
                Quantity = reader.IsDBNull(reader.GetOrdinal("Quantity")) ? 0 : reader.GetInt32(reader.GetOrdinal("Quantity")),
                CreatedAt = reader.IsDBNull(reader.GetOrdinal("CreatedAt")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                Notes = reader.IsDBNull(reader.GetOrdinal("Notes")) ? null : reader.GetString(reader.GetOrdinal("Notes")),
                UserName = reader.IsDBNull(reader.GetOrdinal("UserName")) ? null : reader.GetString(reader.GetOrdinal("UserName"))
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

public static async Task<ApiResult<ProductionStageEntriesViewDTO>> GetProductionStageEntriesByIDAsync(
    int ID,
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<ProductionStageEntriesViewDTO>();
    var dto = new ProductionStageEntriesViewDTO();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_GetProductionStageEntriesByID", connection) { CommandType = CommandType.StoredProcedure };
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
            dto.OrderID = reader.IsDBNull(reader.GetOrdinal("OrderID")) ? 0 : reader.GetInt32(reader.GetOrdinal("OrderID"));
            dto.OrderStageID = reader.IsDBNull(reader.GetOrdinal("OrderStageID")) ? 0 : reader.GetInt32(reader.GetOrdinal("OrderStageID"));
            dto.Quantity = reader.IsDBNull(reader.GetOrdinal("Quantity")) ? 0 : reader.GetInt32(reader.GetOrdinal("Quantity"));
            dto.CreatedAt = reader.IsDBNull(reader.GetOrdinal("CreatedAt")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("CreatedAt"));
            dto.Notes = reader.IsDBNull(reader.GetOrdinal("Notes")) ? null : reader.GetString(reader.GetOrdinal("Notes"));
            dto.UserName = reader.IsDBNull(reader.GetOrdinal("UserName")) ? null : reader.GetString(reader.GetOrdinal("UserName"));
        }
        reader.Close();
        result.Data = dto;
        result.Message = messageParameter.Value?.ToString();
        result.ErrorType = ErrorTypeMapper.GetErrorType(Convert.ToInt32(errorTypeParameter.Value));
    }
    catch (Exception ex)
    {
        result.Data = null;
        result.Message = "Database error occurred while fetching the productionstageentries";
        result.ErrorType = ErrorType.DatabaseError;
    }
    return result;
}




}

