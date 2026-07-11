using DataAccess.Repositories.Interface;
using Entitys.Products;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext _context;

        public ProductRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Products>> GetAllAsync()
        {
            // Return only non-deleted and active products
            return await _context.Products
                .Where(p => !p.IsDeleted && p.Active)
                .ToListAsync();
        }

        public async Task<Products?> GetByIdAsync(int id)
        {
            // Ensure we don't return soft-deleted products
            return await _context.Products
                .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted && p.Active);
        }

        public async Task<Products?> GetByIdIncludeDeletedAsync(int id)
        {
            // Ignore global query filters to allow finding soft-deleted items
            return await _context.Products
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task AddAsync(Products product)
        {
            await _context.Products.AddAsync(product);
        }

        public void Update(Products product)
        {

            _context.Products.Update(product);
        }

        public void Delete(Products products)
        {
            // Soft-delete: mark as inactive and deleted
            products.Active = false;
            products.IsDeleted = true;
            products.UpdatedAt = DateTime.UtcNow;
            _context.Products.Update(products);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }

}
