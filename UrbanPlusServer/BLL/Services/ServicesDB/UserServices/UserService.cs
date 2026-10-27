using AutoMapper;

using BLL.Services.ServiceSupport.ImageServices;
using BLL.Services.ServiceSupport.TokenServices;
using DAL.Entities;
using DAL.Repositories.UserRepositories;
using DTO.UserDTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace BLL.Services.ServicesDB.UserServices
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IImageService _imageService;
        private readonly ITokenService _tokens;
        private readonly IPasswordHasher<Users> _hasher;
        private readonly IMapper _mapper;

        public UserService(IUserRepository userRepository,IImageService imageService,IMapper mapper, ITokenService tokens, IPasswordHasher<Users> hasher)
        {
            _userRepository = userRepository;
            _imageService = imageService;
            _tokens = tokens;
            _mapper = mapper;
            _hasher = hasher;
        }

        public bool CreateUser(CreateUserDTO dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto));

            if (string.IsNullOrWhiteSpace(dto.Email))
                throw new ArgumentException("Email is required.");

            var email = dto.Email.Trim().ToLowerInvariant();

            if (_userRepository.IsEmailExists(email))
                return false;

            var user = _mapper.Map<Users>(dto);

            user.Email = email;
            user.CreatedAt = DateTime.UtcNow;
            user.RoleCode = 0;
            user.ScoreReliability = 50;

            // הצפנת הסיסמה באמצעות Hash
            user.passwordHash = _hasher.HashPassword(user, dto.password);

            // שמירת תמונת פרופיל, אם נשלחה
            if (dto.ProfilePicture != null)
            {
                user.ProfilePicture = _imageService.Save(dto.ProfilePicture);
            }

            var createdUser = _userRepository.Add(user);

            return createdUser != null;
        }


        public AuthResponseUserDto? Login(LoginUserDTO dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto));

            if (string.IsNullOrWhiteSpace(dto.Email) ||
                string.IsNullOrWhiteSpace(dto.password))
                return null;

            var email = dto.Email.Trim().ToLowerInvariant();

            var user = _userRepository.GetByEmailAndProvider(email, dto.AuthProvider);

            if (user == null)
                return null;

            var result = _hasher.VerifyHashedPassword( user, user.passwordHash, dto.password );

            if (result == PasswordVerificationResult.Failed)
                return null;

            return _tokens.CreateToken(user);
        }


        public ProfileUserDTO? GetUserById(int userId)
        {
            if (userId <= 0)
                return null;

            var user = _userRepository.GetById(userId);

            return user == null? null
                : _mapper.Map<ProfileUserDTO>(user);
        }

        public ShortProfileUserDTO? GetShortUserById(int userId)
        {
            if (userId <= 0)
                return null;

            var user = _userRepository.GetById(userId);

            return user == null
                ? null
                : _mapper.Map<ShortProfileUserDTO>(user);
        }

        public ProfileUserDTO? UpdateUser(int userId,UpdateUserDTO dto)
        {
            if (userId <= 0 || dto == null)
                return null;

            var user = _userRepository.GetById(userId);

            if (user == null)
                return null;

            if (string.IsNullOrWhiteSpace(dto.FirstName))
                throw new ArgumentException(
                    "First name is required.");

            if (dto.FirstName.Trim().Length > 200)
                throw new ArgumentException(
                    "First name cannot exceed 200 characters.");

            if (string.IsNullOrWhiteSpace(dto.LastName))
                throw new ArgumentException(
                    "Last name is required.");

            if (dto.LastName.Trim().Length > 200)
                throw new ArgumentException(
                    "Last name cannot exceed 200 characters.");

            user.FirstName = dto.FirstName.Trim();
            user.LastName = dto.LastName.Trim();

            // עדכון תמונת פרופיל, אם נשלחה תמונה חדשה
            if (dto.ProfilePicture != null)
            {
                var oldImage = user.ProfilePicture;
                var newImage = _imageService.Save(dto.ProfilePicture);

                user.ProfilePicture = newImage;

                try
                {
                    var updatedUser = _userRepository.Update(user);

                    // מחיקת התמונה הישנה רק אחרי עדכון מוצלח
                    if (!string.IsNullOrWhiteSpace(oldImage))
                        _imageService.Delete(oldImage);

                    return _mapper.Map<ProfileUserDTO>(updatedUser);
                }
                catch
                {
                    // ניקוי הקובץ החדש אם עדכון המשתמש נכשל
                    _imageService.Delete(newImage);
                    throw;
                }
            }

            var result = _userRepository.Update(user);

            return _mapper.Map<ProfileUserDTO>(result);
        }

        public bool DeleteUser(int userId)
        {
            if (userId <= 0)
                return false;

            var user = _userRepository.GetById(userId);

            if (user == null)
                return false;

            var deleted = _userRepository.Delete(userId);

            if (deleted && !string.IsNullOrWhiteSpace(user.ProfilePicture))
                _imageService.Delete(user.ProfilePicture);

            return deleted;
        }
    }
}
