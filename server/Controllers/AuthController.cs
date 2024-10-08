using ChatApp.Models.DTOs;
using ChatApp.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;

    public AuthController(IUserService userService)
    {
        _userService = userService;
    }

    // Registers a new user with provided credentials   
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserCredentials registrationCredentials)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _userService.RegisterUserAsync(registrationCredentials);
        if (result.Success)
        {
            return Ok(new { message = "User registered successfully." });
        }
        
        return BadRequest(new { message = result.ErrorMessage });
    }

    // Authenticates a user and returns a token if successful
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserCredentials loginCredentials)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var token = await _userService.AuthenticateUserAsync(loginCredentials);
        if (token != null)
        {
            return Ok(new { token });
        }

        return Unauthorized(new { message = "Invalid credentials." });
    }
}
