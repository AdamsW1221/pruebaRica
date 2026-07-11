using Entitys.Products;

namespace DataAccess.Repositories.Interface
{
    public interface IProductRepository
    {
        Task<IEnumerable<Products>> GetAllAsync();
        Task<Products?> GetByIdAsync(int id);
        // Gets product regardless of soft-delete filter (used for restore/activate operations)
        Task<Products?> GetByIdIncludeDeletedAsync(int id);
        Task AddAsync(Products product);
        void Update(Products product);
        void Delete(Products product);
        Task<bool> SaveChangesAsync();
    }
}
