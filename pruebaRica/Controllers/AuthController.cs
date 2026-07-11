using BusinessLogic.DTOs;
using BusinessLogic.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace pruebaRica.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
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

            return Ok(response);
        }
    }

}
