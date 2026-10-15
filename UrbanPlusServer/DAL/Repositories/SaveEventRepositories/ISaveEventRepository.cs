using DAL.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Repositories.SaveEventRepositories
{
    public interface ISaveEventRepository
    {
        List<SavedEvents> GetAll();
        SavedEvents? GetById(int id);
        SavedEvents Add(SavedEvents savedEvent);
        bool Delete(int id);
    }
}
