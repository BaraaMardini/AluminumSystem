public class Report_ProductionSummaryViewDTO
{
    public int OrdersCount { get; set; }

    public int TotalRequestedQuantity { get; set; }

    public int TotalProducedQuantity { get; set; }

    public int RemainingQuantity { get; set; }

    public int TotalWasteQuantity { get; set; }

    public decimal ProductionCompletionPercentage { get; set; }

    public decimal WastePercentage { get; set; }

    public int CompletedOrdersCount { get; set; }

    public int IncompleteOrdersCount { get; set; }

    public Report_ProductionSummaryViewDTO() { }

    public Report_ProductionSummaryViewDTO(
        int ordersCount,
        int totalRequestedQuantity,
        int totalProducedQuantity,
        int remainingQuantity,
        int totalWasteQuantity,
        decimal productionCompletionPercentage,
        decimal wastePercentage,
        int completedOrdersCount,
        int incompleteOrdersCount)
    {
        OrdersCount = ordersCount;
        TotalRequestedQuantity = totalRequestedQuantity;
        TotalProducedQuantity = totalProducedQuantity;
        RemainingQuantity = remainingQuantity;
        TotalWasteQuantity = totalWasteQuantity;
        ProductionCompletionPercentage =
            productionCompletionPercentage;
        WastePercentage = wastePercentage;
        CompletedOrdersCount = completedOrdersCount;
        IncompleteOrdersCount = incompleteOrdersCount;
    }
}