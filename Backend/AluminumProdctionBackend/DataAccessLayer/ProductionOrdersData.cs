
using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Threading;
using System.Threading.Tasks;

using ConnectionString;

public static class ProductionOrdersData
{
public static async Task<ApiResult<List<ProductionOrdersViewDTO>>> GetAllProductionOrdersAsync(
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<List<ProductionOrdersViewDTO>>();
    var list = new List<ProductionOrdersViewDTO>();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_GetAllProductionOrders", connection) { CommandType = CommandType.StoredProcedure };
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        using var reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
        while (reader.Read())
        {
            list.Add(new ProductionOrdersViewDTO
            {
                ID = reader.IsDBNull(reader.GetOrdinal("ID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ID")),
                ProductName = reader.IsDBNull(reader.GetOrdinal("ProductName")) ? null : reader.GetString(reader.GetOrdinal("ProductName")),
                RequestedQuantity = reader.IsDBNull(reader.GetOrdinal("RequestedQuantity")) ? 0 : reader.GetInt32(reader.GetOrdinal("RequestedQuantity")),
                StatusName = reader.IsDBNull(reader.GetOrdinal("StatusName")) ? null : reader.GetString(reader.GetOrdinal("StatusName")),
                CreatedAt = reader.IsDBNull(reader.GetOrdinal("CreatedAt")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                UpdatedAt = reader.IsDBNull(reader.GetOrdinal("UpdatedAt")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("UpdatedAt")),
                Notes = reader.IsDBNull(reader.GetOrdinal("Notes")) ? null : reader.GetString(reader.GetOrdinal("Notes")),
                CreatedBy = reader.IsDBNull(reader.GetOrdinal("CreatedBy")) ? null : reader.GetString(reader.GetOrdinal("CreatedBy"))
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

public static async Task<ApiResult<ProductionOrdersDTO>> AddProductionOrdersAsync(
    ProductionOrdersDTO productionorders,
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<ProductionOrdersDTO>();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_AddProductionOrders", connection) { CommandType = CommandType.StoredProcedure };
        command.Parameters.Add("@ProductID", SqlDbType.Int).Value = productionorders.ProductID;
        command.Parameters.Add("@RequestedQuantity", SqlDbType.Int).Value = productionorders.RequestedQuantity;
        command.Parameters.Add("@StatusID", SqlDbType.Int).Value = productionorders.StatusID;
        command.Parameters.Add("@Email", SqlDbType.NVarChar, 50).Value = (object?)productionorders.Email ?? DBNull.Value;
        command.Parameters.Add("@Notes", SqlDbType.NVarChar, 50).Value = (object?)productionorders.Notes ?? DBNull.Value;
        var outputID = new SqlParameter("@NewID", SqlDbType.Int) { Direction = ParameterDirection.Output };
        var outputMsg = new SqlParameter("@Message", SqlDbType.NVarChar, 250) { Direction = ParameterDirection.Output };
        var outputErrorType = new SqlParameter("@ErrorType", SqlDbType.Int) { Direction = ParameterDirection.Output };
        command.Parameters.Add(outputID);
        command.Parameters.Add(outputMsg);
        command.Parameters.Add(outputErrorType);
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        await command.ExecuteNonQueryAsync(cancellationToken).ConfigureAwait(false);
        productionorders.ID = (int)outputID.Value;
        result.Data = productionorders;
        result.Message = outputMsg.Value?.ToString();
        result.ErrorType = ErrorTypeMapper.GetErrorType(Convert.ToInt32(outputErrorType.Value));
    }
    catch (Exception ex)
    {
        result.Data = null;
        result.Message = "Database error occurred while adding the productionorders.";
        result.ErrorType = ErrorType.DatabaseError;
    }
    return result;
}

public static async Task<ApiResult<ProductionOrdersDTO>> UpdateProductionOrdersByIDAsync(
    ProductionOrdersUpdateDTO productionorders,
    CancellationToken cancellationToken = default)
{
ProductionOrdersDTO productionordersDTO = new  ProductionOrdersDTO();
    var result = new ApiResult<ProductionOrdersDTO>();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_UpdateProductionOrdersByID", connection) { CommandType = CommandType.StoredProcedure };
        command.Parameters.Add("@ID", SqlDbType.Int).Value = (object?)productionorders.ID ?? DBNull.Value;
            command.Parameters.Add("@StatusID", SqlDbType.Int).Value = (object?)productionorders.StatusID ?? DBNull.Value;
            var outputMsg = new SqlParameter("@Message", SqlDbType.NVarChar, 250) { Direction = ParameterDirection.Output };
        var outputErrorType = new SqlParameter("@ErrorType", SqlDbType.Int) { Direction = ParameterDirection.Output };
        command.Parameters.Add(outputMsg);
        command.Parameters.Add(outputErrorType);
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        using var reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
        if (reader.Read())
        {
            productionordersDTO.ID = reader.IsDBNull(reader.GetOrdinal("ID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ID"));
            productionordersDTO.ProductID = reader.IsDBNull(reader.GetOrdinal("ProductID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ProductID"));
            productionordersDTO.RequestedQuantity = reader.IsDBNull(reader.GetOrdinal("RequestedQuantity")) ? 0 : reader.GetInt32(reader.GetOrdinal("RequestedQuantity"));
            productionordersDTO.StatusID = reader.IsDBNull(reader.GetOrdinal("StatusID")) ? 0 : reader.GetInt32(reader.GetOrdinal("StatusID"));
            productionordersDTO.Email = reader.IsDBNull(reader.GetOrdinal("Email")) ? null : reader.GetString(reader.GetOrdinal("Email"));
            productionordersDTO.Notes = reader.IsDBNull(reader.GetOrdinal("Notes")) ? null : reader.GetString(reader.GetOrdinal("Notes"));
        }
        reader.Close();
        result.Data = productionordersDTO;
        result.Message = outputMsg.Value?.ToString();
        result.ErrorType = ErrorTypeMapper.GetErrorType(Convert.ToInt32(outputErrorType.Value));
    }
    catch (Exception ex)
    {
        result.Data = null;
        result.Message = "Database error occurred while updating the productionorders";
        result.ErrorType = ErrorType.DatabaseError;
    }
    return result;
}

public static async Task<ApiResult<ProductionOrdersDTO>> DeleteProductionOrdersByIDAsync(
    int iD,
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<ProductionOrdersDTO>();
    var productionorders = new ProductionOrdersDTO
    {
        ID = iD,
    };
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_DeleteProductionOrdersByID", connection) { CommandType = CommandType.StoredProcedure };
        command.Parameters.Add("@ID", SqlDbType.Int).Value = productionorders.ID;
        var outputMsg = new SqlParameter("@Message", SqlDbType.NVarChar, 250) { Direction = ParameterDirection.Output };
        var outputErrorType = new SqlParameter("@ErrorType", SqlDbType.Int) { Direction = ParameterDirection.Output };
        command.Parameters.Add(outputMsg);
        command.Parameters.Add(outputErrorType);
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        await command.ExecuteNonQueryAsync(cancellationToken).ConfigureAwait(false);
        result.Data = productionorders;
        result.Message = outputMsg.Value?.ToString();
        result.ErrorType = ErrorTypeMapper.GetErrorType(Convert.ToInt32(outputErrorType.Value));
    }
    catch (Exception ex)
    {
        result.Data = null;
        result.Message = "Database error occurred while deleting the productionorders";
        result.ErrorType = ErrorType.DatabaseError;
    }
    return result;
}

public static async Task<ApiResult<List<ProductionOrdersViewDTO>>> SearchProductionOrders(
string? ProductName,
string? StatusName,
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<List<ProductionOrdersViewDTO>>();
    var list = new List<ProductionOrdersViewDTO>();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_SearchProductionOrders", connection) { CommandType = CommandType.StoredProcedure };
        command.Parameters.Add("@ProductName", SqlDbType.NVarChar).Value = ProductName ;
        command.Parameters.Add("@StatusName", SqlDbType.NVarChar).Value = StatusName ;
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        using var reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
        while (reader.Read())
        {
            list.Add(new ProductionOrdersViewDTO
            {
                ID = reader.IsDBNull(reader.GetOrdinal("ID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ID")),
                ProductName = reader.IsDBNull(reader.GetOrdinal("ProductName")) ? null : reader.GetString(reader.GetOrdinal("ProductName")),
                RequestedQuantity = reader.IsDBNull(reader.GetOrdinal("RequestedQuantity")) ? 0 : reader.GetInt32(reader.GetOrdinal("RequestedQuantity")),
                StatusName = reader.IsDBNull(reader.GetOrdinal("StatusName")) ? null : reader.GetString(reader.GetOrdinal("StatusName")),
                CreatedAt = reader.IsDBNull(reader.GetOrdinal("CreatedAt")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                UpdatedAt = reader.IsDBNull(reader.GetOrdinal("UpdatedAt")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("UpdatedAt")),
                Notes = reader.IsDBNull(reader.GetOrdinal("Notes")) ? null : reader.GetString(reader.GetOrdinal("Notes")),
                CreatedBy = reader.IsDBNull(reader.GetOrdinal("CreatedBy")) ? null : reader.GetString(reader.GetOrdinal("CreatedBy"))
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

public static async Task<ApiResult<ProductionOrdersViewDTO>> GetProductionOrdersByIDAsync(
    int ID,
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<ProductionOrdersViewDTO>();
    var dto = new ProductionOrdersViewDTO();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_GetProductionOrdersByID", connection) { CommandType = CommandType.StoredProcedure };
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
            dto.ProductName = reader.IsDBNull(reader.GetOrdinal("ProductName")) ? null : reader.GetString(reader.GetOrdinal("ProductName"));
            dto.RequestedQuantity = reader.IsDBNull(reader.GetOrdinal("RequestedQuantity")) ? 0 : reader.GetInt32(reader.GetOrdinal("RequestedQuantity"));
            dto.StatusName = reader.IsDBNull(reader.GetOrdinal("StatusName")) ? null : reader.GetString(reader.GetOrdinal("StatusName"));
            dto.CreatedAt = reader.IsDBNull(reader.GetOrdinal("CreatedAt")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("CreatedAt"));
            dto.UpdatedAt = reader.IsDBNull(reader.GetOrdinal("UpdatedAt")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("UpdatedAt"));
            dto.Notes = reader.IsDBNull(reader.GetOrdinal("Notes")) ? null : reader.GetString(reader.GetOrdinal("Notes"));
            dto.CreatedBy = reader.IsDBNull(reader.GetOrdinal("CreatedBy")) ? null : reader.GetString(reader.GetOrdinal("CreatedBy"));
        }
        reader.Close();
        result.Data = dto;
        result.Message = messageParameter.Value?.ToString();
        result.ErrorType = ErrorTypeMapper.GetErrorType(Convert.ToInt32(errorTypeParameter.Value));
    }
    catch (Exception ex)
    {
        result.Data = null;
        result.Message = "Database error occurred while fetching the productionorders";
        result.ErrorType = ErrorType.DatabaseError;
    }
    return result;
}

}

