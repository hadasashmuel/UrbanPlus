using AutoMapper;
using AutoMapper.QueryableExtensions;
using DAL;
using DTO.BadgeDTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Repositories.BadgeRepositories
{
    public class BadgeRepositories : IBadgeRepositories
    {
        private readonly UrbanPlusContext _context;
        private readonly IMapper _mapper;

        public BadgeRepositories(UrbanPlusContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public List<ShowBadgeDTO> GetAllBadges()
        {
            return _context.Badges
               .ProjectTo<ShowBadgeDTO>(_mapper.ConfigurationProvider)
               .ToList();
        }
        public ShowBadgeDTO CreateBadge(CreateBadgeDTO dto)
        {
            var badge = _mapper.Map<Badges>(dto);


            _context.Badges.Add(badge);
            _context.SaveChanges();

            var created = _context.Badges
                .First(r => r.BadgeId == badge.BadgeId);

            return _mapper.Map<ShowBadgeDTO>(created);
        }


        public ShowBadgeDTO? GetBadgeById(int id)
        {
            return _context.Badges
              .Where(c => c.BadgeId == id)
              .ProjectTo<ShowBadgeDTO>(_mapper.ConfigurationProvider)
              .FirstOrDefault();
        }


        public bool DeleteBadge(int id)
        {
            var badge = _context.Badges.Find(id);
            if (badge is null)
                return false;

            _context.Badges.Remove(badge);
            _context.SaveChanges();
            return true;
        }
    }

}