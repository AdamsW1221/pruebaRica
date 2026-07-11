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

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductResponseDto>> GetById(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null)
            {
                return NotFound(new { message = "Producto no encontrado." });
            }
            return Ok(product);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
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
        [Authorize(Roles = "Admin")]
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

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _productService.DeleteProductAsync(id);
            if (!success)
            {
                return NotFound(new { message = "Producto no encontrado o no se pudo eliminar." });
            }

            return Ok(new { message = "Producto eliminado exitosamente." });
        }

        // PATCH api/products/{id}/active?active=true
        [HttpPatch("{id}/active")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SetActive(int id, [FromQuery] bool active)
        {
            var success = await _productService.SetProductActiveAsync(id, active);
            if (!success)
            {
                return NotFound(new { message = "Producto no encontrado." });
            }

            if (!active)
                return Ok(new { message = "Producto activado correctamente." });

            return Ok(new { message = "Producto desactivado correctamente." });
        }
    }

}
