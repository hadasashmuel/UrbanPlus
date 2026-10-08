using DAL;
using DTO.UserDTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Repositories.UserRepositories
{
    public interface IUserRepositories
    {
        void CreateUser(Users user);
        Users? LoginUser(LoginUserDTO dto);
        ProfileUserDTO? GetUserById(int userId);
        ShortProfileUserDTO? GetShortUserById(int userId);
        void UpdateUser(Users user);
        bool IsEmailExists(string email);
    }
}
