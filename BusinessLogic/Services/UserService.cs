using BusinessLogic.DTOs;
using BusinessLogic.Services.Interface;
using DataAccess.Repositories.Interface;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace BusinessLogic.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly ITokenService _tokenService;

        public UserService(IUserRepository userRepository, ITokenService tokenService)
        {
            _userRepository = userRepository;
            _tokenService = tokenService;
        }

        public async Task<Entitys.User.User?> RegisterAsync(RegisterRequest registerRequest)
        {
            var existing = await _userRepository.GetByUsernameAsync(registerRequest.Username);
            if (existing != null) return null; 

            var user = new Entitys.User.User
            {
                Username = registerRequest.Username.Trim(),
                PasswordHash = HashPassword(registerRequest.Password),
                Role = string.IsNullOrWhiteSpace(registerRequest.Role) ? "User" : registerRequest.Role.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            await _userRepository.AddAsync(user);
            var saved = await _userRepository.SaveChangesAsync();
            if (!saved) return null;

            return user;
        }

        public async Task<LoginResponse?> LoginAsync(LoginRequest loginRequest)
        {
            var user = await _userRepository.GetByUsernameAsync(loginRequest.Username);

            if (user == null) return null;

            if (!VerifyPassword(loginRequest.Password, user.PasswordHash))
                return null;

            var token = _tokenService.CreateToken(user);

            return new LoginResponse
            {
                Token = token,
                Username = user.Username,
                Role = user.Role
            };
        }

        public async Task<IEnumerable<UserResponseDto>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllAsync();
            var result = new List<UserResponseDto>();
            foreach (var user in users)
            {
                result.Add(new UserResponseDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Role = user.Role,
                    CreatedAt = user.CreatedAt
                });
            }
            return result;
        }

        public async Task<bool> UpdateUserRoleAsync(int id, string newRole)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return false;

            user.Role = newRole;
            _userRepository.Update(user);
            return await _userRepository.SaveChangesAsync();
        }

        public async Task<UserResponseDto?> GetUserByUsernameAsync(string username)
        {
            var user = await _userRepository.GetByUsernameAsync(username);
            if (user == null) return null;

            return new UserResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return false;

            _userRepository.Delete(user);
            return await _userRepository.SaveChangesAsync();
        }

        public static string HashPassword(string password)
        {
            const int iterations = 100000;
            const int saltSize = 16;
            const int keySize = 32;

            byte[] salt = RandomNumberGenerator.GetBytes(saltSize);
            byte[] key = Rfc2898DeriveBytes.Pbkdf2(password, salt, iterations, HashAlgorithmName.SHA256, keySize);

            return $"{iterations}.{Convert.ToBase64String(salt)}.{Convert.ToBase64String(key)}";
        }

        public static bool VerifyPassword(string password, string hashedPassword)
        {
            try
            {
                var parts = hashedPassword.Split('.', 3);
                if (parts.Length != 3) return false;

                var iterations = int.Parse(parts[0]);
                var salt = Convert.FromBase64String(parts[1]);
                var key = Convert.FromBase64String(parts[2]);

                byte[] keyToCheck = Rfc2898DeriveBytes.Pbkdf2(password, salt, iterations, HashAlgorithmName.SHA256, key.Length);

                return CryptographicOperations.FixedTimeEquals(key, keyToCheck);
            }
            catch
            {
                return false;
            }
        }
    }
}
