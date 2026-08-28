using System;

public class SearchReport_CancelledOrdersRequest
{
    public int? OrderID { get; set; }

    public string? ProductName { get; set; }

    public DateTime? FromDate { get; set; }

    public DateTime? ToDate { get; set; }
}