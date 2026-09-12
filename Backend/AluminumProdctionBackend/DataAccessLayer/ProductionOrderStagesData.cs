
using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Threading;
using System.Threading.Tasks;

using ConnectionString;

public static class ProductionOrderStagesData
{
    public static async Task<ApiResult<List<ProductionOrderStagesViewDTO>>> GetAllProductionOrderStagesAsync(
        CancellationToken cancellationToken = default)
    {
        var result = new ApiResult<List<ProductionOrderStagesViewDTO>>();
        var list = new List<ProductionOrderStagesViewDTO>();
        try
        {
            await using var connection = new SqlConnection(connectionString._connectionString);
            await using var command = new SqlCommand("SP_GetAllProductionOrderStages", connection) { CommandType = CommandType.StoredProcedure };
            await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
            using var reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
            while (reader.Read())
            {
                list.Add(new ProductionOrderStagesViewDTO
                {
                    ID = reader.IsDBNull(reader.GetOrdinal("ID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ID")),
                    OrderID = reader.IsDBNull(reader.GetOrdinal("OrderID")) ? 0 : reader.GetInt32(reader.GetOrdinal("OrderID")),
                    StageName = reader.IsDBNull(reader.GetOrdinal("StageName")) ? null : reader.GetString(reader.GetOrdinal("StageName")),
                    StatusName = reader.IsDBNull(reader.GetOrdinal("StatusName")) ? null : reader.GetString(reader.GetOrdinal("StatusName")),
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

    public static async Task<ApiResult<ProductionOrderStagesDTO>> AddProductionOrderStagesAsync(
        ProductionOrderStagesDTO productionorderstages,
        CancellationToken cancellationToken = default)
    {
        var result = new ApiResult<ProductionOrderStagesDTO>();
        try
        {
            await using var connection = new SqlConnection(connectionString._connectionString);
            await using var command = new SqlCommand("SP_AddProductionOrderStages", connection) { CommandType = CommandType.StoredProcedure };
            command.Parameters.Add("@OrderID", SqlDbType.Int).Value = productionorderstages.OrderID;
            command.Parameters.Add("@Email", SqlDbType.NVarChar).Value = productionorderstages.Email;


            var outputID = new SqlParameter("@NewID", SqlDbType.Int) { Direction = ParameterDirection.Output };
            var outputMsg = new SqlParameter("@Message", SqlDbType.NVarChar, 250) { Direction = ParameterDirection.Output };
            var outputErrorType = new SqlParameter("@ErrorType", SqlDbType.Int) { Direction = ParameterDirection.Output };
            command.Parameters.Add(outputID);
            command.Parameters.Add(outputMsg);
            command.Parameters.Add(outputErrorType);
            await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
            await command.ExecuteNonQueryAsync(cancellationToken).ConfigureAwait(false);
            productionorderstages.ID = (int)outputID.Value;
            result.Data = productionorderstages;
            result.Message = outputMsg.Value?.ToString();
            result.ErrorType = ErrorTypeMapper.GetErrorType(Convert.ToInt32(outputErrorType.Value));
        }
        catch (Exception ex)
        {
            result.Data = null;
            result.Message = "Database error occurred while adding the productionorderstages.";
            result.ErrorType = ErrorType.DatabaseError;
        }
        return result;
    }

    public static async Task<ApiResult<ProductionOrderStagesDTO>> UpdateProductionOrderStagesByIDAsync(
        ProductionOrderStagesUpdateDTO productionorderstages,
        CancellationToken cancellationToken = default)
    {
        ProductionOrderStagesDTO productionorderstagesDTO = new ProductionOrderStagesDTO();
        var result = new ApiResult<ProductionOrderStagesDTO>();
        try
        {
            await using var connection = new SqlConnection(connectionString._connectionString);
            await using var command = new SqlCommand("SP_UpdateProductionOrderStagesByID", connection) { CommandType = CommandType.StoredProcedure };
            command.Parameters.Add("@ID", SqlDbType.Int).Value = (object?)productionorderstages.ID ?? DBNull.Value;
            command.Parameters.Add("@StatusID", SqlDbType.Int).Value = (object?)productionorderstages.StatusID ?? DBNull.Value;
            var outputMsg = new SqlParameter("@Message", SqlDbType.NVarChar, 250) { Direction = ParameterDirection.Output };
            var outputErrorType = new SqlParameter("@ErrorType", SqlDbType.Int) { Direction = ParameterDirection.Output };
            command.Parameters.Add(outputMsg);
            command.Parameters.Add(outputErrorType);
            await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
            using var reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
            if (reader.Read())
            {
                productionorderstagesDTO.ID = reader.IsDBNull(reader.GetOrdinal("ID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ID"));
                productionorderstagesDTO.OrderID = reader.IsDBNull(reader.GetOrdinal("OrderID")) ? 0 : reader.GetInt32(reader.GetOrdinal("OrderID"));
            }
            reader.Close();
            result.Data = productionorderstagesDTO;
            result.Message = outputMsg.Value?.ToString();
            result.ErrorType = ErrorTypeMapper.GetErrorType(Convert.ToInt32(outputErrorType.Value));
        }
        catch (Exception ex)
        {
            result.Data = null;
            result.Message = "Database error occurred while updating the productionorderstages";
            result.ErrorType = ErrorType.DatabaseError;
        }
        return result;
    }

    public static async Task<ApiResult<List<ProductionOrderStagesViewDTO>>> SearchProductionOrderStages(
    int? OrderID,
    string? StageName,
    string? StatusName,
        CancellationToken cancellationToken = default)
    {
        var result = new ApiResult<List<ProductionOrderStagesViewDTO>>();
        var list = new List<ProductionOrderStagesViewDTO>();
        try
        {
            await using var connection = new SqlConnection(connectionString._connectionString);
            await using var command = new SqlCommand("SP_SearchProductionOrderStages", connection) { CommandType = CommandType.StoredProcedure };
            command.Parameters.Add("@OrderID", SqlDbType.Int).Value = OrderID;
            command.Parameters.Add("@StageName", SqlDbType.NVarChar).Value = StageName;
            command.Parameters.Add("@StatusName", SqlDbType.NVarChar).Value = StatusName;
            await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
            using var reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
            while (reader.Read())
            {
                list.Add(new ProductionOrderStagesViewDTO
                {
                    ID = reader.IsDBNull(reader.GetOrdinal("ID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ID")),
                    OrderID = reader.IsDBNull(reader.GetOrdinal("OrderID")) ? 0 : reader.GetInt32(reader.GetOrdinal("OrderID")),
                    StageName = reader.IsDBNull(reader.GetOrdinal("StageName")) ? null : reader.GetString(reader.GetOrdinal("StageName")),
                    StatusName = reader.IsDBNull(reader.GetOrdinal("StatusName")) ? null : reader.GetString(reader.GetOrdinal("StatusName")),
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

    public static async Task<ApiResult<ProductionOrderStagesViewDTO>> GetProductionOrderStagesByIDAsync(
        int ID,
        CancellationToken cancellationToken = default)
    {
        var result = new ApiResult<ProductionOrderStagesViewDTO>();
        var dto = new ProductionOrderStagesViewDTO();
        try
        {
            await using var connection = new SqlConnection(connectionString._connectionString);
            await using var command = new SqlCommand("SP_GetProductionOrderStagesByID", connection) { CommandType = CommandType.StoredProcedure };
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
                dto.StageName = reader.IsDBNull(reader.GetOrdinal("StageName")) ? null : reader.GetString(reader.GetOrdinal("StageName"));
                dto.StatusName = reader.IsDBNull(reader.GetOrdinal("StatusName")) ? null : reader.GetString(reader.GetOrdinal("StatusName"));
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
            result.Message = "Database error occurred while fetching the productionorderstages";
            result.ErrorType = ErrorType.DatabaseError;
        }
        return result;
    }
    public static async Task<ApiResult<List<ProductionOrderStagesViewDTO>>> SearchProductionOrderStages(
int? StageID,
    CancellationToken cancellationToken = default)
    {
        var result = new ApiResult<List<ProductionOrderStagesViewDTO>>();
        var list = new List<ProductionOrderStagesViewDTO>();
        try
        {
            await using var connection = new SqlConnection(connectionString._connectionString);
            await using var command = new SqlCommand("SP_SearchProductionOrderStages", connection) { CommandType = CommandType.StoredProcedure };
            command.Parameters.Add("@StageID", SqlDbType.Int).Value = StageID;
            await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
            using var reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
            while (reader.Read())
            {
                list.Add(new ProductionOrderStagesViewDTO
                {
                    ID = reader.IsDBNull(reader.GetOrdinal("ID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ID")),
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


}

