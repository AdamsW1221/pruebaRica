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

        public async Task<(IEnumerable<Products> Items, int TotalCount)> GetPagedAsync(int page, int pageSize, string? search = null, string? filter = "active")
        {
            IQueryable<Products> query = _context.Products;

            if (filter == "inactive")
            {
                query = query.IgnoreQueryFilters().Where(p => p.IsDesactivate || !p.Active);
            }
            else
            {
                query = query.Where(p => !p.IsDesactivate && p.Active);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                var searchLower = search.Trim().ToLower();
                query = query.Where(p => p.Name.ToLower().Contains(searchLower) || p.Description.ToLower().Contains(searchLower));
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderBy(p => p.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
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
