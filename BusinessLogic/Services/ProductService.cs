using BusinessLogic.DTOs;
using BusinessLogic.Services.Interface;
using DataAccess.Repositories.Interface;
using Entitys.Products;

namespace BusinessLogic.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<IEnumerable<ProductResponseDto>> GetAllProductsAsync()
        {
            var products = await _productRepository.GetAllAsync();
            return products.Select(p => MapToResponseDto(p));
        }

        public async Task<IEnumerable<ProductResponseDto>> GetAllProductsIncludeDeactivatedAsync()
        {
            var products = await _productRepository.GetAllIncludeDeactivatedAsync();
            return products.Select(p => MapToResponseDto(p));
        }

        public async Task<ProductResponseDto?> GetProductByIdAsync(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null) return null;
            return MapToResponseDto(product);
        }

        public async Task<ProductResponseDto> CreateProductAsync(ProductCreateDto createDto)
        {
            var product = new Products
            {
                Name = createDto.Name.Trim(),
                Description = createDto.Description?.Trim() ?? string.Empty,
                Quantity = createDto.Quantity,
                ImageUrl = createDto.ImageUrl?.Trim(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _productRepository.AddAsync(product);
            await _productRepository.SaveChangesAsync();

            return MapToResponseDto(product);
        }

        public async Task<ProductResponseDto?> UpdateProductAsync(int id, ProductUpdateDto updateDto)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null) return null;

            product.Name = updateDto.Name.Trim();
            product.Description = updateDto.Description?.Trim() ?? string.Empty;
            product.Quantity = updateDto.Quantity;
            product.ImageUrl = updateDto.ImageUrl?.Trim();
            product.UpdatedAt = DateTime.UtcNow;

            _productRepository.Update(product);
            await _productRepository.SaveChangesAsync();

            return MapToResponseDto(product);
        }

        public async Task<bool> DeactivateProductAsync(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null) return false;

            _productRepository.Deactivate(product);
            return await _productRepository.SaveChangesAsync();
        }

        public async Task<bool> HardDeleteProductAsync(int id)
        {
            var product = await _productRepository.GetByIdIncludeDeactivatedAsync(id);
            if (product == null) return false;

            await _productRepository.HardDeleteAsync(product);
            return await _productRepository.SaveChangesAsync();
        }

        public async Task<bool> SetProductActiveAsync(int id, bool active)
        {
            var product = await _productRepository.GetByIdIncludeDeactivatedAsync(id);
            if (product == null) return false;

            product.Active = true;
            product.IsDesactivate = false;
            product.UpdatedAt = DateTime.UtcNow;

            _productRepository.Update(product);
            return await _productRepository.SaveChangesAsync();
        }

        private static ProductResponseDto MapToResponseDto(Products product)
        {
            return new ProductResponseDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Quantity = product.Quantity,
                ImageUrl = product.ImageUrl,
                CreatedAt = product.CreatedAt,
                UpdatedAt = product.UpdatedAt,
                Active = product.Active,
                IsDesactivate = product.IsDesactivate
            };
        }
    }
}
