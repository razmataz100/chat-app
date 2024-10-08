using ChatApp.Models.DTOs;
using System.Threading.Tasks;

namespace ChatApp.Services
{
    public interface IUserService
    {
        Task<RegistrationResult> RegisterUserAsync(UserCredentials registrationCredentials);
        Task<string> AuthenticateUserAsync(UserCredentials loginCredentials);
    }
}
