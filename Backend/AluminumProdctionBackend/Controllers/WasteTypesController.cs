using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Threading.Tasks;

[Authorize]
[Route("api/wastetypess")]
[ApiController]
public class WasteTypesController : ControllerBase
{
    // =====================================================
    // VIEW = 8589934592
    // =====================================================

    [HasPermission(8589934592)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpGet("all", Name = "GetAllWasteTypes")]
    public async Task<ActionResult> GetAllWasteTypes(
        CancellationToken cancellationToken)
    {
        var result = await WasteTypesService
            .GetAllWasteTypesAsync(cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }


    // =====================================================
    // CREATE = 4294967296
    // =====================================================

    [HasPermission(4294967296)]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpPost(Name = "AddWasteTypes")]
    public async Task<ActionResult> AddWasteTypes(
        [FromBody] WasteTypesDTO dto,
        CancellationToken cancellationToken)
    {
        var result = await WasteTypesService
            .AddWasteTypesAsync(
                dto,
                cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result,
            newID: result.Data?.ID,
            routeName: nameof(GetWasteTypesByID),
            routeParamName: "id");
    }


    // =====================================================
    // EDIT = 17179869184
    // =====================================================

    [HasPermission(17179869184)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpPut("{id}", Name = "UpdateWasteTypesByID")]
    public async Task<ActionResult> UpdateWasteTypesByID(
        int id,
        [FromBody] WasteTypesUpdateDTO dto,
        CancellationToken cancellationToken)
    {
        dto.ID = id;

        var result = await WasteTypesService
            .UpdateWasteTypesByIDAsync(
                dto,
                cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }


    // =====================================================
    // VIEW = 8589934592
    // =====================================================

    [HasPermission(8589934592)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpGet("{id}", Name = "GetWasteTypesByID")]
    public async Task<ActionResult> GetWasteTypesByID(
        int id,
        CancellationToken cancellationToken)
    {
        var result = await WasteTypesService
            .GetWasteTypesByIDAsync(
                id,
                cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }
}