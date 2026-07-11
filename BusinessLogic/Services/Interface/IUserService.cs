using BusinessLogic.DTOs;
using Entitys.User;

namespace BusinessLogic.Services.Interface
{
    public interface IUserService
    {
        Task<LoginResponse?> LoginAsync(LoginRequest loginRequest);
        Task<User?> RegisterAsync(RegisterRequest registerRequest);
    }
}
