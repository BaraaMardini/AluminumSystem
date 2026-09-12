using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Threading.Tasks;

[Authorize]
[Route("api/productionorderss")]
[ApiController]
public class ProductionOrdersController : ControllerBase
{
    // =====================================================
    // VIEW = 4096
    // =====================================================

    [HasPermission(4096)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpGet("all", Name = "GetAllProductionOrders")]
    public async Task<ActionResult> GetAllProductionOrders(
        CancellationToken cancellationToken)
    {
        var result = await ProductionOrdersService.GetAllProductionOrdersAsync(
            cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }


    // =====================================================
    // CREATE = 2048
    // =====================================================

    [HasPermission(2048)]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpPost(Name = "AddProductionOrders")]
    public async Task<ActionResult> AddProductionOrders(
        [FromBody] ProductionOrdersDTO dto,
        CancellationToken cancellationToken)
    {
        var result = await ProductionOrdersService.AddProductionOrdersAsync(
            dto,
            cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result,
            newID: result.Data?.ID,
            routeName: nameof(GetProductionOrdersByID),
            routeParamName: "id");
    }


    // =====================================================
    // EDIT = 8192
    // =====================================================

    [HasPermission(8192)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpPut("{id}", Name = "UpdateProductionOrdersByID")]
    public async Task<ActionResult> UpdateProductionOrdersByID(
        int id,
        [FromBody] ProductionOrdersUpdateDTO dto,
        CancellationToken cancellationToken)
    {
        dto.ID = id;

        var result = await ProductionOrdersService.UpdateProductionOrdersByIDAsync(
            dto,
            cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }


    // =====================================================
    // DELETE = 16384
    // =====================================================

    [HasPermission(16384)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpDelete("{id}", Name = "DeleteProductionOrdersByID")]
    public async Task<ActionResult> DeleteProductionOrdersByID(
        int id,
        CancellationToken cancellationToken)
    {
        var result = await ProductionOrdersService.DeleteProductionOrdersByIDAsync(
            id,
            cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }


    // =====================================================
    // VIEW = 4096
    // =====================================================

    [HasPermission(4096)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpGet("SearchProductionOrders")]
    public async Task<ActionResult> SearchProductionOrders(
        [FromQuery] SearchProductionOrdersRequest request,
        CancellationToken cancellationToken)
    {
        var result = await ProductionOrdersService.SearchProductionOrders(
            request.ProductName,
            request.StatusName,
            cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }


    // =====================================================
    // VIEW = 4096
    // =====================================================

    [HasPermission(4096)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpGet("{id}", Name = "GetProductionOrdersByID")]
    public async Task<ActionResult> GetProductionOrdersByID(
        int id,
        CancellationToken cancellationToken)
    {
        var result = await ProductionOrdersService.GetProductionOrdersByIDAsync(
            id,
            cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }
}