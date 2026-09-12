public class Report_ProductComparisonViewDTO
{
    public int ProductID { get; set; }

    public string? ProductName { get; set; }

    public int TotalRequestedQuantity { get; set; }

    public int TotalProducedQuantity { get; set; }

    public int TotalWasteQuantity { get; set; }

    public int RemainingQuantity { get; set; }

    public decimal ProductionCompletionPercentage { get; set; }

    public decimal WastePercentage { get; set; }


    public Report_ProductComparisonViewDTO()
    {
    }


    public Report_ProductComparisonViewDTO(
        int productID,
        string? productName,
        int totalRequestedQuantity,
        int totalProducedQuantity,
        int totalWasteQuantity,
        int remainingQuantity,
        decimal productionCompletionPercentage,
        decimal wastePercentage)
    {
        ProductID = productID;
        ProductName = productName;
        TotalRequestedQuantity = totalRequestedQuantity;
        TotalProducedQuantity = totalProducedQuantity;
        TotalWasteQuantity = totalWasteQuantity;
        RemainingQuantity = remainingQuantity;
        ProductionCompletionPercentage =
            productionCompletionPercentage;
        WastePercentage = wastePercentage;
    }
}