using DTO.UserDTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Services.ServicesDB.UserServices
{
    public interface IUserService
    {
        ProfileUserDTO CreateUser(CreateUserDTO dto);

       // ProfileUserDTO? LoginUser(LoginUserDTO dto);

        ProfileUserDTO? GetUserById(int userId);

        ShortProfileUserDTO? GetShortUserById(int userId);

        ProfileUserDTO? UpdateUser(int userId,UpdateUserDTO dto);

        bool DeleteUser(int userId);
    }
}
