using Entitys.Products;

namespace DataAccess.Repositories.Interface
{
    public interface IProductRepository
    {
        Task<IEnumerable<Products>> GetAllAsync();
        Task<IEnumerable<Products>> GetAllIncludeDeactivatedAsync();
        Task<Products?> GetByIdAsync(int id);
        Task<Products?> GetByIdIncludeDeactivatedAsync(int id);
        Task<(IEnumerable<Products> Items, int TotalCount)> GetPagedAsync(int page, int pageSize, string? search = null, string? filter = "active");
        Task AddAsync(Products product);
        void Update(Products product);
        void Deactivate(Products product);
        Task HardDeleteAsync(Products product);
        Task<bool> SaveChangesAsync();
    }
}

