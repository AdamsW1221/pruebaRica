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
            return await _context.Products
                .Where(p => !p.IsDesactivate && p.Active)
                .ToListAsync();
        }

        public async Task<IEnumerable<Products>> GetAllIncludeDeactivatedAsync()
        {
            return await _context.Products
                .IgnoreQueryFilters()
                .ToListAsync();
        }

        public async Task<Products?> GetByIdAsync(int id)
        {
            return await _context.Products
                .FirstOrDefaultAsync(p => p.Id == id && !p.IsDesactivate && p.Active);
        }

        public async Task<Products?> GetByIdIncludeDeactivatedAsync(int id)
        {
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

        public void Deactivate(Products product)
        {
            product.Active = false;
            product.IsDesactivate = true;
            product.UpdatedAt = DateTime.UtcNow;
            _context.Products.Update(product);
        }

        public async Task HardDeleteAsync(Products product)
        {
            _context.Products.Remove(product);
            await Task.CompletedTask;
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
