using Entitys.Products;
using Entitys.User;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class ApplicationDbContext: DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {}

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Products> Products { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");
                entity.HasIndex(e => e.Username).IsUnique();
            });

            modelBuilder.Entity<Products>(entity =>
            {
                entity.ToTable("Products");

                entity.HasQueryFilter(p => !p.IsDesactivate && p.Active);
            });
        }
    }
}
