using BusinessLogic.DTOs;
using Entitys.User;

namespace BusinessLogic.Services.Interface
{
    public interface IUserService
    {
        Task<LoginResponse?> LoginAsync(LoginRequest loginRequest);
        Task<User?> RegisterAsync(RegisterRequest registerRequest);
        Task<IEnumerable<UserResponseDto>> GetAllUsersAsync();
        Task<bool> UpdateUserRoleAsync(int id, string newRole);
        Task<UserResponseDto?> GetUserByUsernameAsync(string username);
        Task<bool> DeleteUserAsync(int id);
    }
}
