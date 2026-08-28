using System;
using System.Collections.Generic;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;

using ConnectionString;

public static class Report_ProductComparisonData
{
    public static async Task<ApiResult<List<Report_ProductComparisonViewDTO>>> SearchReport_ProductComparison(
        DateTime? FromDate,
        DateTime? ToDate,
        CancellationToken cancellationToken = default)
    {
        var result =
            new ApiResult<List<Report_ProductComparisonViewDTO>>();

        var list =
            new List<Report_ProductComparisonViewDTO>();

        try
        {
            await using var connection =
                new SqlConnection(connectionString._connectionString);

            await using var command =
                new SqlCommand(
                    "SP_SearchReport_ProductComparison",
                    connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

            // ---------------------------------------------------------
            // Parameters
            // ---------------------------------------------------------

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
                list.Add(new Report_ProductComparisonViewDTO
                {
                    // -------------------------------------------------
                    // Product Information
                    // -------------------------------------------------

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

                    // -------------------------------------------------
                    // Requested Quantity
                    // -------------------------------------------------

                    TotalRequestedQuantity =
                        reader.IsDBNull(
                            reader.GetOrdinal("TotalRequestedQuantity"))
                        ? 0
                        : reader.GetInt32(
                            reader.GetOrdinal("TotalRequestedQuantity")),

                    // -------------------------------------------------
                    // Produced Quantity
                    // -------------------------------------------------

                    TotalProducedQuantity =
                        reader.IsDBNull(
                            reader.GetOrdinal("TotalProducedQuantity"))
                        ? 0
                        : reader.GetInt32(
                            reader.GetOrdinal("TotalProducedQuantity")),

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
                "Database error occurred while fetching product comparison report.";

            result.ErrorType =
                ErrorType.DatabaseError;
        }
        catch (Exception)
        {
            result.Data = null;
            result.Message =
                "An unexpected error occurred while fetching product comparison report.";

            result.ErrorType =
                ErrorType.DatabaseError;
        }

        return result;
    }
}