using System;
using System.Collections.Generic;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;

using ConnectionString;

public static class Report_ProductProductionData
{
    public static async Task<ApiResult<List<Report_ProductProductionViewDTO>>>
        SearchReport_ProductProduction(
            int? ProductID,
            DateTime? FromDate,
            DateTime? ToDate,
            CancellationToken cancellationToken = default)
    {
        var result =
            new ApiResult<List<Report_ProductProductionViewDTO>>();

        var list =
            new List<Report_ProductProductionViewDTO>();

        try
        {
            await using var connection =
                new SqlConnection(connectionString._connectionString);

            await using var command =
                new SqlCommand(
                    "SP_SearchReport_ProductProduction",
                    connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

            // ---------------------------------------------------------
            // Parameters
            // ---------------------------------------------------------

            command.Parameters.Add("@ProductID", SqlDbType.Int).Value =
                (object?)ProductID ?? DBNull.Value;

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
            // Read
            // ---------------------------------------------------------

            while (await reader.ReadAsync(cancellationToken)
                .ConfigureAwait(false))
            {
                list.Add(new Report_ProductProductionViewDTO
                {
                    ProductID =
                        reader.IsDBNull(
                            reader.GetOrdinal("ProductID"))
                        ? 0
                        : reader.GetInt32(
                            reader.GetOrdinal("ProductID")),

                    ProductName =
                        reader.IsDBNull(
                            reader.GetOrdinal("ProductName"))
                        ? null
                        : reader.GetString(
                            reader.GetOrdinal("ProductName")),

                    TotalRequestedQuantity =
                        reader.IsDBNull(
                            reader.GetOrdinal("TotalRequestedQuantity"))
                        ? 0
                        : reader.GetInt32(
                            reader.GetOrdinal("TotalRequestedQuantity")),

                    // -------------------------------------------------
                    // Cutting
                    // -------------------------------------------------

                    CuttingQuantity =
                        reader.IsDBNull(
                            reader.GetOrdinal("CuttingQuantity"))
                        ? 0
                        : reader.GetInt32(
                            reader.GetOrdinal("CuttingQuantity")),

                    CuttingWaste =
                        reader.IsDBNull(
                            reader.GetOrdinal("CuttingWaste"))
                        ? 0
                        : reader.GetInt32(
                            reader.GetOrdinal("CuttingWaste")),

                    CuttingGoodQuantity =
                        reader.IsDBNull(
                            reader.GetOrdinal("CuttingGoodQuantity"))
                        ? 0
                        : reader.GetInt32(
                            reader.GetOrdinal("CuttingGoodQuantity")),

                    // -------------------------------------------------
                    // Painting
                    // -------------------------------------------------

                    PaintingQuantity =
                        reader.IsDBNull(
                            reader.GetOrdinal("PaintingQuantity"))
                        ? 0
                        : reader.GetInt32(
                            reader.GetOrdinal("PaintingQuantity")),

                    PaintingWaste =
                        reader.IsDBNull(
                            reader.GetOrdinal("PaintingWaste"))
                        ? 0
                        : reader.GetInt32(
                            reader.GetOrdinal("PaintingWaste")),

                    PaintingGoodQuantity =
                        reader.IsDBNull(
                            reader.GetOrdinal("PaintingGoodQuantity"))
                        ? 0
                        : reader.GetInt32(
                            reader.GetOrdinal("PaintingGoodQuantity")),

                    // -------------------------------------------------
                    // Packaging
                    // -------------------------------------------------

                    PackagingQuantity =
                        reader.IsDBNull(
                            reader.GetOrdinal("PackagingQuantity"))
                        ? 0
                        : reader.GetInt32(
                            reader.GetOrdinal("PackagingQuantity")),

                    PackagingWaste =
                        reader.IsDBNull(
                            reader.GetOrdinal("PackagingWaste"))
                        ? 0
                        : reader.GetInt32(
                            reader.GetOrdinal("PackagingWaste")),

                    FinalProducedQuantity =
                        reader.IsDBNull(
                            reader.GetOrdinal("FinalProducedQuantity"))
                        ? 0
                        : reader.GetInt32(
                            reader.GetOrdinal("FinalProducedQuantity")),

                    // -------------------------------------------------
                    // Waste
                    // -------------------------------------------------

                    TotalWasteQuantity =
                        reader.IsDBNull(
                            reader.GetOrdinal("TotalWasteQuantity"))
                        ? 0
                        : reader.GetInt32(
                            reader.GetOrdinal("TotalWasteQuantity")),

                    // -------------------------------------------------
                    // Remaining
                    // -------------------------------------------------

                    RemainingQuantity =
                        reader.IsDBNull(
                            reader.GetOrdinal("RemainingQuantity"))
                        ? 0
                        : reader.GetInt32(
                            reader.GetOrdinal("RemainingQuantity")),

                    // -------------------------------------------------
                    // Percentages
                    // -------------------------------------------------

                    ProductionCompletionPercentage =
                        reader.IsDBNull(
                            reader.GetOrdinal(
                                "ProductionCompletionPercentage"))
                        ? 0m
                        : reader.GetDecimal(
                            reader.GetOrdinal(
                                "ProductionCompletionPercentage")),

                    WastePercentage =
                        reader.IsDBNull(
                            reader.GetOrdinal("WastePercentage"))
                        ? 0m
                        : reader.GetDecimal(
                            reader.GetOrdinal("WastePercentage"))
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