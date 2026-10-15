using DAL.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Repositories.SaveEventRepositories
{
    public interface ISaveEventRepository
    {
        List<SavedEvents> GetByUserId(int userId);
        SavedEvents? GetById(int id, int userId);
        SavedEvents Add(SavedEvents savedEvent);
        bool Delete(int id, int userId);
    }
}
