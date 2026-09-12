using Microsoft.AspNetCore.Http.HttpResults;
using System.ComponentModel.DataAnnotations;
using static System.Runtime.InteropServices.JavaScript.JSType;

public class Report_OrdersViewDTO
{
    public int OrderID { get; set; }
    public string ProductName { get; set; }
    public int RequestedQuantity { get; set; }
    public int CuttingQuantity { get; set; }
    public int CuttingWaste { get; set; }
    public int CuttingGoodQuantity { get; set; }
    public int PaintingQuantity { get; set; }
    public int PaintingWaste { get; set; }
    public int PaintingGoodQuantity { get; set; }
    public int PackagingQuantity { get; set; }
    public int PackagingWaste { get; set; }
    public int FinalProducedQuantity { get; set; }
    public int TotalWasteQuantity { get; set; }
    public int RemainingQuantity { get; set; }
    public decimal ProductionCompletionPercentage { get; set; }
    public decimal WastePercentage { get; set; }
    public string StatusName { get; set; }
    public DateTime CreatedAt { get; set; }

public Report_OrdersViewDTO() { }

public Report_OrdersViewDTO(int orderID, string productName, int requestedQuantity, int cuttingQuantity, int cuttingWaste, int cuttingGoodQuantity, int paintingQuantity, int paintingWaste, int paintingGoodQuantity, int packagingQuantity, int packagingWaste, int finalProducedQuantity, int totalWasteQuantity, int remainingQuantity, decimal productionCompletionPercentage, decimal wastePercentage, string statusName, DateTime createdAt)
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
    TotalWasteQuantity = totalWasteQuantity;
    RemainingQuantity = remainingQuantity;
    ProductionCompletionPercentage = productionCompletionPercentage;
    WastePercentage = wastePercentage;
    StatusName = statusName;
    CreatedAt = createdAt;
   
}
}
