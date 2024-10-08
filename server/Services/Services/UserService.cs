using ChatApp.Data;
using ChatApp.Models;
using ChatApp.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace ChatApp.Services
{
    public class UserService : IUserService
{
    private readonly ChatAppDbContext _dbContext;
    private readonly ITokenService _tokenService;
    
    
    private readonly byte[] _fixedKey = Encoding.UTF8.GetBytes("mySuperSecretFixedKey12345");

    public UserService(ChatAppDbContext dbContext, ITokenService tokenService)
    {
        _dbContext = dbContext;
        _tokenService = tokenService;
    }

    // Registers a new user 
    public async Task<RegistrationResult> RegisterUserAsync(UserCredentials registrationCredentials)
    {
        if (await _dbContext.Users.AnyAsync(u => u.Username == registrationCredentials.Username))
        {
            return new RegistrationResult { Success = false, ErrorMessage = "Username already exists." };
        }

        var user = new User
        {
            Username = registrationCredentials.Username,
            Password = HashPassword(registrationCredentials.Password)
        };

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();

        return new RegistrationResult { Success = true };
    }

    // Authenticates a user and returns a JWT token if successful
    public async Task<string> AuthenticateUserAsync(UserCredentials loginCredentials)
    {
        var user = await _dbContext.Users.SingleOrDefaultAsync(u => u.Username == loginCredentials.Username);
        if (user != null && VerifyPassword(loginCredentials.Password, user.Password))
        {
            return _tokenService.GenerateJwtToken(user.Username);
        }
        return null;
    }

    // Hashes the password using HMACSHA256
    private string HashPassword(string password)
    {
        using (var hmac = new HMACSHA256(_fixedKey))
        {
            var passwordBytes = Encoding.UTF8.GetBytes(password);
            var hashBytes = hmac.ComputeHash(passwordBytes);
            return Convert.ToBase64String(hashBytes);
        }
    }

    // Verifies the provided password against the stored hash
    private bool VerifyPassword(string password, string storedHash)
    {
        using (var hmac = new HMACSHA256(_fixedKey))
        {
            var passwordBytes = Encoding.UTF8.GetBytes(password);
            var computedHash = hmac.ComputeHash(passwordBytes);
            return Convert.ToBase64String(computedHash) == storedHash;
        }
    }
}

}
