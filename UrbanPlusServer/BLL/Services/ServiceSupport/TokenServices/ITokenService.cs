using DAL.Entities;
using DTO.UserDTO;
namespace BLL.Services.ServiceSupport.TokenServices
{
    public interface ITokenService
    {
        AuthResponseUserDto CreateToken(Users user);
    }
}
