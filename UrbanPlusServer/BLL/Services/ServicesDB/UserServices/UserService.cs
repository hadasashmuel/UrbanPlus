using AutoMapper;
using DAL.Entities;
using DAL.Repositories.UserRepositories;
using DTO.UserDTO;

namespace BLL.Services.ServicesDB.UserServices
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserService( IUserRepository userRepository,IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public ProfileUserDTO CreateUser(CreateUserDTO dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto));

            if (string.IsNullOrWhiteSpace(dto.Email))
                throw new ArgumentException("Email is required.");

            if (_userRepository.IsEmailExists(dto.Email))
                throw new InvalidOperationException( "A user with this email already exists.");

            var user = _mapper.Map<Users>(dto);

            user.Email = dto.Email.Trim();
            user.CreatedAt = DateTime.UtcNow;
            user.RoleCode = 0;

            // יש לבחור ערך התחלתי בהתאם לכללי הפרויקט.
            user.ScoreReliability = 50;

            var createdUser = _userRepository.Add(user);

            return _mapper.Map<ProfileUserDTO>(createdUser);
        }

        public ProfileUserDTO? GetUserById(int userId)
        {
            if (userId <= 0)
                return null;

            var user = _userRepository.GetById(userId);

            return user == null
                ? null
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


        public ProfileUserDTO? UpdateUser(int userId, UpdateUserDTO dto)
        {
            if (userId <= 0 || dto == null)
                return null;

            var user = _userRepository.GetById(userId);

            if (user == null)
                return null;

            if (string.IsNullOrWhiteSpace(dto.FirstName))
                throw new ArgumentException("First name is required.");

            if (dto.FirstName.Trim().Length > 200)
                throw new ArgumentException(
                    "First name cannot exceed 200 characters.");

            if (string.IsNullOrWhiteSpace(dto.LastName))
                throw new ArgumentException("Last name is required.");

            if (dto.LastName.Trim().Length > 200)
                throw new ArgumentException(
                    "Last name cannot exceed 200 characters.");

            user.FirstName = dto.FirstName.Trim();
            user.LastName = dto.LastName.Trim();

            var updatedUser = _userRepository.Update(user);

            return _mapper.Map<ProfileUserDTO>(updatedUser);
        }

        public bool DeleteUser(int userId)
        {
            if (userId <= 0)
                return false;

            return _userRepository.Delete(userId);
        }
    }
}