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
        List<MainEvents> GetCandidateEvents(int categoryId, DateTime since);
        string? GetCategoryName(int categoryId);
        List<MainEvents> SearchMainEvents(string? categoryName,string? address,bool onlyOpen);
        bool DeleteMainEvent(int id);
    }
}
