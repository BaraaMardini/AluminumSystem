using System;
using System.Collections.Generic;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;

using ConnectionString;

public static class Report_OrdersData
{
    public static async Task<ApiResult<List<Report_OrdersViewDTO>>> SearchReport_Orders(
        int? OrderID,
        string? ProductName,
        string? StatusName,
        DateTime? FromDate,
        DateTime? ToDate,
        CancellationToken cancellationToken = default)
    {
        var result = new ApiResult<List<Report_OrdersViewDTO>>();
        var list = new List<Report_OrdersViewDTO>();

        try
        {
            await using var connection =
                new SqlConnection(connectionString._connectionString);

            await using var command =
                new SqlCommand("SP_SearchReport_Orders", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

            // ---------------------------------------------------------
            // Parameters
            // ---------------------------------------------------------

            command.Parameters.Add("@OrderID", SqlDbType.Int).Value =
                (object?)OrderID ?? DBNull.Value;

            command.Parameters.Add("@ProductName", SqlDbType.NVarChar, -1).Value =
                (object?)ProductName ?? DBNull.Value;

            command.Parameters.Add("@StatusName", SqlDbType.NVarChar, -1).Value =
                (object?)StatusName ?? DBNull.Value;

            command.Parameters.Add("@FromDate", SqlDbType.DateTime).Value =
                (object?)FromDate ?? DBNull.Value;

            command.Parameters.Add("@ToDate", SqlDbType.DateTime).Value =
                (object?)ToDate ?? DBNull.Value;

            // ---------------------------------------------------------
            // Open Connection
            // ---------------------------------------------------------

            await connection.OpenAsync(cancellationToken)
                .ConfigureAwait(false);

            // ---------------------------------------------------------
            // Execute
            // ---------------------------------------------------------

            await using var reader =
                await command.ExecuteReaderAsync(cancellationToken)
                    .ConfigureAwait(false);

            // ---------------------------------------------------------
            // Read Data
            // ---------------------------------------------------------

            while (await reader.ReadAsync(cancellationToken)
                       .ConfigureAwait(false))
            {
                list.Add(new Report_OrdersViewDTO
                {
                    // -------------------------------------------------
                    // Order Information
                    // -------------------------------------------------

                    OrderID = reader.IsDBNull(
                        reader.GetOrdinal("OrderID"))
                        ? 0
                        : reader.GetInt32(
                            reader.GetOrdinal("OrderID")),

                    ProductName = reader.IsDBNull(
                        reader.GetOrdinal("ProductName"))
                        ? null
                        : reader.GetString(
                            reader.GetOrdinal("ProductName")),

                    RequestedQuantity = reader.IsDBNull(
                        reader.GetOrdinal("RequestedQuantity"))
                        ? 0
                        : reader.GetInt32(
                            reader.GetOrdinal("RequestedQuantity")),

                    // -------------------------------------------------
                    // Cutting
                    // -------------------------------------------------

                    CuttingQuantity = reader.IsDBNull(
                        reader.GetOrdinal("CuttingQuantity"))
                        ? 0
                        : reader.GetInt32(
                            reader.GetOrdinal("CuttingQuantity")),

                    CuttingWaste = reader.IsDBNull(
                        reader.GetOrdinal("CuttingWaste"))
                        ? 0
                        : reader.GetInt32(
                            reader.GetOrdinal("CuttingWaste")),

                    CuttingGoodQuantity = reader.IsDBNull(
                        reader.GetOrdinal("CuttingGoodQuantity"))
                        ? 0
                        : reader.GetInt32(
                            reader.GetOrdinal("CuttingGoodQuantity")),

                    // -------------------------------------------------
                    // Painting
                    // -------------------------------------------------

                    PaintingQuantity = reader.IsDBNull(
                        reader.GetOrdinal("PaintingQuantity"))
                        ? 0
                        : reader.GetInt32(
                            reader.GetOrdinal("PaintingQuantity")),

                    PaintingWaste = reader.IsDBNull(
                        reader.GetOrdinal("PaintingWaste"))
                        ? 0
                        : reader.GetInt32(
                            reader.GetOrdinal("PaintingWaste")),

                    PaintingGoodQuantity = reader.IsDBNull(
                        reader.GetOrdinal("PaintingGoodQuantity"))
                        ? 0
                        : reader.GetInt32(
                            reader.GetOrdinal("PaintingGoodQuantity")),

                    // -------------------------------------------------
                    // Packaging
                    // -------------------------------------------------

                    PackagingQuantity = reader.IsDBNull(
                        reader.GetOrdinal("PackagingQuantity"))
                        ? 0
                        : reader.GetInt32(
                            reader.GetOrdinal("PackagingQuantity")),

                    PackagingWaste = reader.IsDBNull(
                        reader.GetOrdinal("PackagingWaste"))
                        ? 0
                        : reader.GetInt32(
                            reader.GetOrdinal("PackagingWaste")),

                    FinalProducedQuantity = reader.IsDBNull(
                        reader.GetOrdinal("FinalProducedQuantity"))
                        ? 0
                        : reader.GetInt32(
                            reader.GetOrdinal("FinalProducedQuantity")),

                    // -------------------------------------------------
                    // Total Waste
                    // -------------------------------------------------

                    TotalWasteQuantity = reader.IsDBNull(
                        reader.GetOrdinal("TotalWasteQuantity"))
                        ? 0
                        : reader.GetInt32(
                            reader.GetOrdinal("TotalWasteQuantity")),

                    // -------------------------------------------------
                    // Remaining
                    // -------------------------------------------------

                    RemainingQuantity = reader.IsDBNull(
                        reader.GetOrdinal("RemainingQuantity"))
                        ? 0
                        : reader.GetInt32(
                            reader.GetOrdinal("RemainingQuantity")),

                    // -------------------------------------------------
                    // Percentages
                    // -------------------------------------------------

                    ProductionCompletionPercentage = reader.IsDBNull(
                        reader.GetOrdinal("ProductionCompletionPercentage"))
                        ? 0m
                        : reader.GetDecimal(
                            reader.GetOrdinal("ProductionCompletionPercentage")),

                    WastePercentage = reader.IsDBNull(
                        reader.GetOrdinal("WastePercentage"))
                        ? 0m
                        : reader.GetDecimal(
                            reader.GetOrdinal("WastePercentage")),

                    // -------------------------------------------------
                    // Status
                    // -------------------------------------------------

                    StatusName = reader.IsDBNull(
                        reader.GetOrdinal("StatusName"))
                        ? null
                        : reader.GetString(
                            reader.GetOrdinal("StatusName")),

                    // -------------------------------------------------
                    // Created At
                    // -------------------------------------------------

                    CreatedAt = reader.IsDBNull(
                        reader.GetOrdinal("CreatedAt"))
                        ? DateTime.MinValue
                        : reader.GetDateTime(
                            reader.GetOrdinal("CreatedAt"))
                });
            }

            result.Data = list;
        }
        catch (OperationCanceledException)
        {
            throw;
        }
        catch (SqlException)
        {
            result.Data = null;
            result.Message =
                "Database error occurred while fetching data.";
            result.ErrorType = ErrorType.DatabaseError;
        }
        catch (Exception)
        {
            result.Data = null;
            result.Message =
                "An unexpected error occurred while fetching data.";
            result.ErrorType = ErrorType.DatabaseError;
        }

        return result;
    }
}