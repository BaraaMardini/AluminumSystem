using System;

public class Report_CancelledOrdersViewDTO
{
    public int OrderID { get; set; }

    public string? ProductName { get; set; }

    public int RequestedQuantity { get; set; }

    // =====================================================
    // Cutting
    // =====================================================

    public int CuttingQuantity { get; set; }

    public int CuttingWaste { get; set; }

    public int CuttingGoodQuantity { get; set; }

    // =====================================================
    // Painting
    // =====================================================

    public int PaintingQuantity { get; set; }

    public int PaintingWaste { get; set; }

    public int PaintingGoodQuantity { get; set; }

    // =====================================================
    // Packaging
    // =====================================================

    public int PackagingQuantity { get; set; }

    public int PackagingWaste { get; set; }

    public int FinalProducedQuantity { get; set; }

    // =====================================================
    // Total Production
    // =====================================================

    public int TotalProducedAcrossStages { get; set; }

    // =====================================================
    // Waste
    // =====================================================

    public int TotalWasteQuantity { get; set; }

    public decimal WastePercentage { get; set; }

    // =====================================================
    // Status
    // =====================================================

    public string? StatusName { get; set; }

    // =====================================================
    // Created At
    // =====================================================

    public DateTime CreatedAt { get; set; }


    // =====================================================
    // Empty Constructor
    // =====================================================

    public Report_CancelledOrdersViewDTO()
    {
    }


    // =====================================================
    // Full Constructor
    // =====================================================

    public Report_CancelledOrdersViewDTO(
        int orderID,
        string? productName,
        int requestedQuantity,

        int cuttingQuantity,
        int cuttingWaste,
        int cuttingGoodQuantity,

        int paintingQuantity,
        int paintingWaste,
        int paintingGoodQuantity,

        int packagingQuantity,
        int packagingWaste,
        int finalProducedQuantity,

        int totalProducedAcrossStages,

        int totalWasteQuantity,
        decimal wastePercentage,

        string? statusName,
        DateTime createdAt)
    {
        OrderID = orderID;
        ProductName = productName;
        RequestedQuantity = requestedQuantity;

        CuttingQuantity = cuttingQuantity;
        CuttingWaste = cuttingWaste;
        CuttingGoodQuantity = cuttingGoodQuantity;

        PaintingQuantity = paintingQuantity;
        PaintingWaste = paintingWaste;
        PaintingGoodQuantity = paintingGoodQuantity;

        PackagingQuantity = packagingQuantity;
        PackagingWaste = packagingWaste;
        FinalProducedQuantity = finalProducedQuantity;

        TotalProducedAcrossStages = totalProducedAcrossStages;

        TotalWasteQuantity = totalWasteQuantity;
        WastePercentage = wastePercentage;

        StatusName = statusName;
        CreatedAt = createdAt;
    }
}