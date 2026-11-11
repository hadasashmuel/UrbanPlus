using DAL.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Services.ServiceSupport.EventAggregationServices
{
    public interface IEventAggregationService
    {
        MainEvents FindOrCreateMainEvent(Reports report);
    }
}
