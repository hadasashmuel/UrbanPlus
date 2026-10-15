using DAL.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Repositories.UserRepositories
{
    public class UserRepository : IUserRepository
    {
        private readonly UrbanPlusContext _context;

        public UserRepository(UrbanPlusContext context)
        {
            _context = context;
        }

        public Users Add(Users user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();

            return user;
        }

        public Users? GetById(int userId)
        {
            return _context.Users.FirstOrDefault(u => u.UserId == userId);
        }

        public Users? GetByEmailAndProvider(string email,AuthProvider authProvider)
        {
            return _context.Users
                .FirstOrDefault(u =>
                    u.Email == email &&
                    u.AuthProvider == authProvider);
        }

        public Users Update(Users user)
        {
            _context.Users.Update(user);
            _context.SaveChanges();

            return user;
        }

        public bool IsEmailExists(string email)
        {
            return _context.Users.Any(u => u.Email == email);
        }

        public bool Delete(int userId)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserId == userId);

            if (user == null)
                return false;

            _context.Users.Remove(user);
            _context.SaveChanges();

            return true;
        }
    }
}
