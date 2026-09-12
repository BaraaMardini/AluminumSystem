using System;
using System.Collections.Generic;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;

using ConnectionString;

public static class Report_ProductionSummaryData
{
    public static async Task<
        ApiResult<List<Report_ProductionSummaryViewDTO>>>
        SearchReport_ProductionSummary(
            DateTime? FromDate,
            DateTime? ToDate,
            CancellationToken cancellationToken = default)
    {
        var result =
            new ApiResult<List<Report_ProductionSummaryViewDTO>>();

        var list =
            new List<Report_ProductionSummaryViewDTO>();

        try
        {
            await using var connection =
                new SqlConnection(
                    connectionString._connectionString);

            await using var command =
                new SqlCommand(
                    "SP_SearchReport_ProductionSummary",
                    connection)
                {
                    CommandType =
                        CommandType.StoredProcedure
                };

            // ---------------------------------------------------------
            // Parameters
            // ---------------------------------------------------------

            command.Parameters.Add(
                "@FromDate",
                SqlDbType.DateTime).Value =
                    (object?)FromDate ?? DBNull.Value;

            command.Parameters.Add(
                "@ToDate",
                SqlDbType.DateTime).Value =
                    (object?)ToDate ?? DBNull.Value;

            // ---------------------------------------------------------
            // Open
            // ---------------------------------------------------------

            await connection.OpenAsync(
                cancellationToken)
                .ConfigureAwait(false);

            // ---------------------------------------------------------
            // Execute
            // ---------------------------------------------------------

            await using var reader =
                await command.ExecuteReaderAsync(
                    cancellationToken)
                    .ConfigureAwait(false);

            // ---------------------------------------------------------
            // Read
            // ---------------------------------------------------------

            while (await reader.ReadAsync(
                cancellationToken)
                .ConfigureAwait(false))
            {
                list.Add(
                    new Report_ProductionSummaryViewDTO
                    {
                        OrdersCount =
                            reader.IsDBNull(
                                reader.GetOrdinal(
                                    "OrdersCount"))
                            ? 0
                            : reader.GetInt32(
                                reader.GetOrdinal(
                                    "OrdersCount")),

                        TotalRequestedQuantity =
                            reader.IsDBNull(
                                reader.GetOrdinal(
                                    "TotalRequestedQuantity"))
                            ? 0
                            : reader.GetInt32(
                                reader.GetOrdinal(
                                    "TotalRequestedQuantity")),

                        TotalProducedQuantity =
                            reader.IsDBNull(
                                reader.GetOrdinal(
                                    "TotalProducedQuantity"))
                            ? 0
                            : reader.GetInt32(
                                reader.GetOrdinal(
                                    "TotalProducedQuantity")),

                        RemainingQuantity =
                            reader.IsDBNull(
                                reader.GetOrdinal(
                                    "RemainingQuantity"))
                            ? 0
                            : reader.GetInt32(
                                reader.GetOrdinal(
                                    "RemainingQuantity")),

                        TotalWasteQuantity =
                            reader.IsDBNull(
                                reader.GetOrdinal(
                                    "TotalWasteQuantity"))
                            ? 0
                            : reader.GetInt32(
                                reader.GetOrdinal(
                                    "TotalWasteQuantity")),

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
                                reader.GetOrdinal(
                                    "WastePercentage"))
                            ? 0m
                            : reader.GetDecimal(
                                reader.GetOrdinal(
                                    "WastePercentage")),

                        CompletedOrdersCount =
                            reader.IsDBNull(
                                reader.GetOrdinal(
                                    "CompletedOrdersCount"))
                            ? 0
                            : reader.GetInt32(
                                reader.GetOrdinal(
                                    "CompletedOrdersCount")),

                        IncompleteOrdersCount =
                            reader.IsDBNull(
                                reader.GetOrdinal(
                                    "IncompleteOrdersCount"))
                            ? 0
                            : reader.GetInt32(
                                reader.GetOrdinal(
                                    "IncompleteOrdersCount"))
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
            result.ErrorType =
                ErrorType.DatabaseError;
        }
        catch (Exception)
        {
            result.Data = null;
            result.Message =
                "An unexpected error occurred while fetching data.";
            result.ErrorType =
                ErrorType.DatabaseError;
        }

        return result;
    }
}