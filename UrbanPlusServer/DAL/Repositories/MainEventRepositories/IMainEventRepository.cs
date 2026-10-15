using DAL.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Repositories.MainEventRepositories
{
    public interface IMainEventRepository
    {
        List<MainEvents> GetAllMainEvents();
        MainEvents? GetMainEventById(int id);
        MainEvents AddMainEvent(MainEvents mainEvent);
        bool UpdateMainEvent(MainEvents mainEvent);
        bool DeleteMainEvent(int id);
    }
}
