using BusinessLogic.DTOs;
using BusinessLogic.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace pruebaRica.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult> Register([FromBody] RegisterRequest registerRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdUser = await _userService.RegisterAsync(registerRequest);

            if (createdUser == null)
            {
                return Conflict(new { message = "El nombre de usuario ya existe o no se pudo crear el usuario." });
            }

            var result = new { id = createdUser.Id, username = createdUser.Username, role = createdUser.Role };
            return Created($"/api/users/{createdUser.Id}", result);
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest loginRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _userService.LoginAsync(loginRequest);

            if (response == null)
            {
                return Unauthorized(new { message = "Usuario o contraseña incorrectos." });
            }

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddHours(4)
            };

            Response.Cookies.Append("jwt", response.Token, cookieOptions);

            return Ok(new LoginResponse
            {
                Token = response.Token,
                Username = response.Username,
                Role = response.Role
            });
        }

        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None
            });

            return Ok(new { message = "Sesión cerrada correctamente." });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<UserResponseDto>> GetMe()
        {
            var username = User.Identity?.Name;
            if (string.IsNullOrEmpty(username))
            {
                return Unauthorized();
            }

            var userDto = await _userService.GetUserByUsernameAsync(username);
            if (userDto == null)
            {
                return Unauthorized();
            }

            return Ok(userDto);
        }
    }
}
