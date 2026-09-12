using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Threading.Tasks;

[Authorize]
[Route("api/productionstagewastess")]
[ApiController]
public class ProductionStageWastesController : ControllerBase
{
    // =====================================================
    // VIEW = 67108864
    // =====================================================

    [HasPermission(67108864)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpGet("all", Name = "GetAllProductionStageWastes")]
    public async Task<ActionResult> GetAllProductionStageWastes(
        CancellationToken cancellationToken)
    {
        var result = await ProductionStageWastesService
            .GetAllProductionStageWastesAsync(cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }


    // =====================================================
    // CREATE = 33554432
    // =====================================================

    [HasPermission(33554432)]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpPost(Name = "AddProductionStageWastes")]
    public async Task<ActionResult> AddProductionStageWastes(
        [FromBody] ProductionStageWastesDTO dto,
        CancellationToken cancellationToken)
    {
        var result = await ProductionStageWastesService
            .AddProductionStageWastesAsync(
                dto,
                cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result,
            newID: result.Data?.ID,
            routeName: nameof(GetProductionStageWastesByID),
            routeParamName: "id");
    }


    // =====================================================
    // EDIT = 134217728
    // =====================================================

    [HasPermission(134217728)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpPut("{id}", Name = "UpdateProductionStageWastesByID")]
    public async Task<ActionResult> UpdateProductionStageWastesByID(
        int id,
        [FromBody] ProductionStageWastesUpdateDTO dto,
        CancellationToken cancellationToken)
    {
        dto.ID = id;

        var result = await ProductionStageWastesService
            .UpdateProductionStageWastesByIDAsync(
                dto,
                cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }


    // =====================================================
    // DELETE = 268435456
    // =====================================================

    [HasPermission(268435456)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpDelete("{id}", Name = "DeleteProductionStageWastesByID")]
    public async Task<ActionResult> DeleteProductionStageWastesByID(
        int id,
        CancellationToken cancellationToken)
    {
        var result = await ProductionStageWastesService
            .DeleteProductionStageWastesByIDAsync(
                id,
                cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }


    // =====================================================
    // VIEW = 67108864
    // =====================================================

    [HasPermission(67108864)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpGet("SearchProductionStageWastes")]
    public async Task<ActionResult> SearchProductionStageWastes(
        [FromQuery] SearchProductionStageWastesRequest request,
        CancellationToken cancellationToken)
    {
        var result = await ProductionStageWastesService
            .SearchProductionStageWastes(
                request.OrderStageID,
                request.StageName,
                request.WasteTypesName,
                request.WasteReasonsName,
                cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }


    // =====================================================
    // VIEW = 67108864
    // =====================================================

    [HasPermission(67108864)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpGet("{id}", Name = "GetProductionStageWastesByID")]
    public async Task<ActionResult> GetProductionStageWastesByID(
        int id,
        CancellationToken cancellationToken)
    {
        var result = await ProductionStageWastesService
            .GetProductionStageWastesByIDAsync(
                id,
                cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }
}