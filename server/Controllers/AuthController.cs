using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChatApp.Models.DTOs;
using ChatApp.Data;
using Microsoft.AspNetCore.Authorization;

namespace ChatApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ChatAppDbContext _context;
        private readonly ITokenService _tokenService;

        public AuthController(ChatAppDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Username == loginRequest.Username);

                if (user != null && user.Password == loginRequest.Password) 
                {
                    var token = _tokenService.GenerateJwtToken(user.Username);
                    return Ok(new { Token = token });
                }

                return Unauthorized("Invalid username or password.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
