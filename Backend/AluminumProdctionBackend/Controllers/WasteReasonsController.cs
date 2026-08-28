using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Threading.Tasks;

[Authorize]
[Route("api/wastereasonss")]
[ApiController]
public class WasteReasonsController : ControllerBase
{
    // =====================================================
    // VIEW = 68719476736
    // =====================================================

    [HasPermission(68719476736)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpGet("all", Name = "GetAllWasteReasons")]
    public async Task<ActionResult> GetAllWasteReasons(
        CancellationToken cancellationToken)
    {
        var result = await WasteReasonsService
            .GetAllWasteReasonsAsync(cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }


    // =====================================================
    // CREATE = 34359738368
    // =====================================================

    [HasPermission(34359738368)]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpPost(Name = "AddWasteReasons")]
    public async Task<ActionResult> AddWasteReasons(
        [FromBody] WasteReasonsDTO dto,
        CancellationToken cancellationToken)
    {
        var result = await WasteReasonsService
            .AddWasteReasonsAsync(
                dto,
                cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result,
            newID: result.Data?.ID,
            routeName: nameof(GetWasteReasonsByID),
            routeParamName: "id");
    }


    // =====================================================
    // EDIT = 137438953472
    // =====================================================

    [HasPermission(137438953472)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpPut("{id}", Name = "UpdateWasteReasonsByID")]
    public async Task<ActionResult> UpdateWasteReasonsByID(
        int id,
        [FromBody] WasteReasonsUpdateDTO dto,
        CancellationToken cancellationToken)
    {
        dto.ID = id;

        var result = await WasteReasonsService
            .UpdateWasteReasonsByIDAsync(
                dto,
                cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }


    // =====================================================
    // VIEW = 68719476736
    // =====================================================

    [HasPermission(68719476736)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpGet("{id}", Name = "GetWasteReasonsByID")]
    public async Task<ActionResult> GetWasteReasonsByID(
        int id,
        CancellationToken cancellationToken)
    {
        var result = await WasteReasonsService
            .GetWasteReasonsByIDAsync(
                id,
                cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }
}