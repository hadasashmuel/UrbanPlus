using DAL.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Repositories.UserRepositories
{
    public interface IUserRepository
    {
        Users Add(Users user);
        Users? GetById(int userId);
        Users? GetByEmailAndProvider(string email,AuthProvider authProvider);
        Users Update(Users user);
        bool IsEmailExists(string email);
        bool Delete(int userId);
        Users? GetOwned(int id, int userId);
        List<Users> GetByUser(int userId);
    }
}
