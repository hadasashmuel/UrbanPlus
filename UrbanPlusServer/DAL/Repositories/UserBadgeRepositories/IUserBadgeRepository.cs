using DAL.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Repositories.UserBadgeRepositories
{
    public interface IUserBadgeRepository
    {
        List<UserBadges> GetAll();
        UserBadges? GetById(int id);
        bool Delete(int id);
    }
}
