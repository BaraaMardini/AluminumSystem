using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Threading.Tasks;

[Authorize]
[Route("api/productss")]
[ApiController]
public class ProductsController : ControllerBase
{
    // =====================================================
    // VIEW = 512
    // =====================================================

    [HasPermission(512)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpGet("all", Name = "GetAllProducts")]
    public async Task<ActionResult> GetAllProducts(
        CancellationToken cancellationToken)
    {
        var result = await ProductsService.GetAllProductsAsync(
            cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }


    // =====================================================
    // CREATE = 256
    // =====================================================

    [HasPermission(256)]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpPost(Name = "AddProducts")]
    public async Task<ActionResult> AddProducts(
        [FromBody] ProductsDTO dto,
        CancellationToken cancellationToken)
    {
        var result = await ProductsService.AddProductsAsync(
            dto,
            cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result,
            newID: result.Data?.ID,
            routeName: nameof(GetProductsByID),
            routeParamName: "id");
    }


    // =====================================================
    // EDIT = 1024
    // =====================================================

    [HasPermission(1024)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpPut("{id}", Name = "UpdateProductsByID")]
    public async Task<ActionResult> UpdateProductsByID(
        int id,
        [FromBody] ProductsUpdateDTO dto,
        CancellationToken cancellationToken)
    {
        dto.ID = id;

        var result = await ProductsService.UpdateProductsByIDAsync(
            dto,
            cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }


    // =====================================================
    // VIEW = 512
    // =====================================================

    [HasPermission(512)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpGet("{id}", Name = "GetProductsByID")]
    public async Task<ActionResult> GetProductsByID(
        int id,
        CancellationToken cancellationToken)
    {
        var result = await ProductsService.GetProductsByIDAsync(
            id,
            cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }
}