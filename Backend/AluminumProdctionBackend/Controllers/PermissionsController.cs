using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[Route("api/permissionss")]
[ApiController]
public class PermissionsController : ControllerBase
{
    // =====================================================
    // VIEW = 64
    // =====================================================

    [HasPermission(64)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpGet("all", Name = "GetAllPermissions")]
    public async Task<ActionResult> GetAllPermissions(
        CancellationToken cancellationToken)
    {
        var result = await PermissionsService
            .GetAllPermissionsAsync(cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }


    // =====================================================
    // CREATE = 32
    // =====================================================

    [HasPermission(32)]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpPost(Name = "AddPermissions")]
    public async Task<ActionResult> AddPermissions(
        [FromBody] PermissionsDTO dto,
        CancellationToken cancellationToken)
    {
        var result = await PermissionsService
            .AddPermissionsAsync(
                dto,
                cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result,
            newID: result.Data?.ID,
            routeName: nameof(GetPermissionsByID),
            routeParamName: "id");
    }


    // =====================================================
    // EDIT = 128
    // =====================================================

    [HasPermission(128)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpPut("{id}", Name = "UpdatePermissionsByID")]
    public async Task<ActionResult> UpdatePermissionsByID(
        int id,
        [FromBody] PermissionsUpdateDTO dto,
        CancellationToken cancellationToken)
    {
        dto.ID = id;

        var result = await PermissionsService
            .UpdatePermissionsByIDAsync(
                dto,
                cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }


    // =====================================================
    // VIEW = 64
    // =====================================================

    [HasPermission(64)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpGet("SearchPermissions")]
    public async Task<ActionResult> SearchPermissions(
        [FromQuery] SearchPermissionsRequest request,
        CancellationToken cancellationToken)
    {
        var result = await PermissionsService
            .SearchPermissions(
                request.ModuleName,
                cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }


    // =====================================================
    // VIEW = 64
    // =====================================================

    [HasPermission(64)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpGet("{id}", Name = "GetPermissionsByID")]
    public async Task<ActionResult> GetPermissionsByID(
        int id,
        CancellationToken cancellationToken)
    {
        var result = await PermissionsService
            .GetPermissionsByIDAsync(
                id,
                cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }
}