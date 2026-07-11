
using BusinessLogic.DTOs;

namespace BusinessLogic.Services.Interface
{
    public interface IProductService
    {
        Task<IEnumerable<ProductResponseDto>> GetAllProductsAsync();
        Task<ProductResponseDto?> GetProductByIdAsync(int id);
        Task<ProductResponseDto> CreateProductAsync(ProductCreateDto createDto);
        Task<ProductResponseDto?> UpdateProductAsync(int id, ProductUpdateDto updateDto);
        Task<bool> DeleteProductAsync(int id);
        Task<bool> SetProductActiveAsync(int id, bool active);
    }

}
