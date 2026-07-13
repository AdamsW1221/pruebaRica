using BusinessLogic.DTOs;
using BusinessLogic.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace pruebaRica.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductResponseDto>>> GetAll()
        {
            var products = await _productService.GetAllProductsAsync();
            return Ok(products);
        }

        [HttpGet("paged")]
        public async Task<ActionResult<PagedResult<ProductResponseDto>>> GetPaged(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 8,
            [FromQuery] string? search = null,
            [FromQuery] string? filter = "active")
        {
            var result = await _productService.GetPagedProductsAsync(page, pageSize, search, filter);
            return Ok(result);
        }

        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<ProductResponseDto>>> GetAllIncludeDeactivated()
        {
            var products = await _productService.GetAllProductsIncludeDeactivatedAsync();
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductResponseDto>> GetById(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null)
            {
                return NotFound(new { message = "Producto no encontrado o inactivo." });
            }
            return Ok(product);
        }

        [HttpPost]
        [Authorize(Roles = "SuperAdmin,superadmin,Admin,admin")]
        public async Task<ActionResult<ProductResponseDto>> Create([FromBody] ProductCreateDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = await _productService.CreateProductAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "SuperAdmin,superadmin,Admin,admin")]
        public async Task<ActionResult<ProductResponseDto>> Update(int id, [FromBody] ProductUpdateDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = await _productService.UpdateProductAsync(id, updateDto);
            if (product == null)
            {
                return NotFound(new { message = "Producto no encontrado." });
            }

            return Ok(product);
        }

        [HttpPatch("{id}/deactivate")]
        [Authorize(Roles = "SuperAdmin,superadmin,Admin,admin")]
        public async Task<IActionResult> Deactivate(int id)
        {
            var success = await _productService.DeactivateProductAsync(id);
            if (!success)
            {
                return NotFound(new { message = "Producto no encontrado o no se pudo desactivar." });
            }

            return Ok(new { message = "Producto desactivado exitosamente." });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "SuperAdmin,superadmin,Admin,admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _productService.HardDeleteProductAsync(id);
            if (!success)
            {
                return NotFound(new { message = "Producto no encontrado o no se pudo eliminar de la base de datos." });
            }

            return Ok(new { message = "Producto eliminado permanentemente de la base de datos." });
        }

        [HttpPatch("{id}/active")]
        [Authorize(Roles = "SuperAdmin,superadmin,Admin,admin")]
        public async Task<IActionResult> SetActive(int id, [FromQuery] bool active)
        {
            var success = await _productService.SetProductActiveAsync(id, active);
            if (!success)
            {
                return NotFound(new { message = "Producto no encontrado." });
            }

            return Ok(new { message = "Producto activado/restaurado correctamente." });
        }
    }
}
