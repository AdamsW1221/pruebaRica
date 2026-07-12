using BusinessLogic.DTOs;

namespace BusinessLogic.Services.Interface
{
    public interface IProductService
    {
        Task<IEnumerable<ProductResponseDto>> GetAllProductsAsync();
        Task<IEnumerable<ProductResponseDto>> GetAllProductsIncludeDeactivatedAsync();
        Task<ProductResponseDto?> GetProductByIdAsync(int id);
        Task<ProductResponseDto> CreateProductAsync(ProductCreateDto createDto);
        Task<ProductResponseDto?> UpdateProductAsync(int id, ProductUpdateDto updateDto);
        Task<bool> DeactivateProductAsync(int id);
        Task<bool> HardDeleteProductAsync(int id);
        Task<bool> SetProductActiveAsync(int id, bool active);
    }
}
