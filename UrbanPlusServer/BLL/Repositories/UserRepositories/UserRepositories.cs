using AutoMapper;
using AutoMapper.QueryableExtensions;
using DAL;
using DTO.UserDTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Repositories.UserRepositories
{
    public class UserRepositories : IUserRepositories
    {
        private readonly UrbanPlusContext _context;
        private readonly IMapper _mapper;

        public UserRepositories(UrbanPlusContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // יצירת משתמש
        public void CreateUser(Users user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
        }

        // התחברות
        public Users? LoginUser(LoginUserDTO dto)
        {
            return _context.Users
                .FirstOrDefault(u =>
                    u.Email == dto.Email &&
                    u.AuthProvider == dto.AuthProvider);
        }

        // קבלת פרופיל מלא
        public ProfileUserDTO? GetUserById(int userId)
        {
            return _context.Users
                .Where(u => u.UserId == userId)
                .ProjectTo<ProfileUserDTO>(_mapper.ConfigurationProvider)
                .FirstOrDefault();
        }

        // קבלת פרופיל מקוצר
        public ShortProfileUserDTO? GetShortUserById(int userId)
        {
            return _context.Users
                .Where(u => u.UserId == userId)
                .ProjectTo<ShortProfileUserDTO>(_mapper.ConfigurationProvider)
                .FirstOrDefault();
        }

        // עדכון משתמש
        public void UpdateUser(Users user)
        {
            _context.Users.Update(user);
            _context.SaveChanges();
        }

        // בדיקה האם אימייל קיים
        public bool IsEmailExists(string email)
        {
            return _context.Users
                .Any(u => u.Email == email);
        }

        // מחיקת משתמש
        public void DeleteUser(int userId)
        {
            var user = _context.Users
                .FirstOrDefault(u => u.UserId == userId);

            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
        }
    }
}
