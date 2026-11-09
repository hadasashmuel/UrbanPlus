using DTO.UserDTO;

namespace BLL.Services.ServicesDB.UserServices
{
    public interface IUserService
    {
        bool CreateUser(CreateUserDTO dto);
        AuthResponseUserDto? Login(LoginUserDTO dto);
        ProfileUserDTO? GetUserById(int userId);
        ShortProfileUserDTO? GetShortUserById(int userId);
        ProfileUserDTO? UpdateUser(int userId, UpdateUserDTO dto);
        bool DeleteUser(int userId);
    }
}
