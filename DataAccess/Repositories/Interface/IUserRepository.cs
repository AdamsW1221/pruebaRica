using Entitys.User;

namespace DataAccess.Repositories.Interface
{
    public interface IUserRepository
    {
        Task<User?> GetByUsernameAsync(string username);
        Task<User?> GetByIdAsync(int id);
        Task AddAsync(User user);
        Task<bool> SaveChangesAsync();
    }
}
