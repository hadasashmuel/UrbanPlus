using AutoMapper;
using AutoMapper.QueryableExtensions;
using DAL;
using DTO.SaveEventDTO;
using DTO.UserBadgeDTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Repositories.UserBadgeRepositories
{
    public class UserBadgeRepositories:IUserBadgeRepositories
    {
        private readonly UrbanPlusContext _context;
        private readonly IMapper _mapper;

        public UserBadgeRepositories(UrbanPlusContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public List<ShowUserBadgeDTO> GetAllUserBadges()
        {
            return _context.UserBadges
               .ProjectTo<ShowUserBadgeDTO>(_mapper.ConfigurationProvider)
               .ToList();
        }
        public ShowUserBadgeDTO? GetUserBadgeById(int id)
        {
            return _context.UserBadges
              .Where(c => c.UserBadgeId == id)
              .ProjectTo<ShowUserBadgeDTO>(_mapper.ConfigurationProvider)
              .FirstOrDefault();
        }


        public bool DeleteUserBadge(int id)
        {
            var userBadge = _context.UserBadges.Find(id);
            if (userBadge is null)
                return false;

            _context.UserBadges.Remove(userBadge);
            _context.SaveChanges();
            return true;
        }
    }
}
