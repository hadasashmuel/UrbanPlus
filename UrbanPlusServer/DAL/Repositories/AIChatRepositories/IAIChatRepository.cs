using DAL.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Repositories.AIChatRepositories
{
    public interface IAIChatRepository
    {
        AIChatSessions CreateSession(AIChatSessions session);
        AIChatSessions? GetSessionById(int sessionId, int userId);
        List<AIChatMessages> GetMessagesBySession(int sessionId);
        AIChatMessages AddMessage(AIChatMessages message);
        AIChatSessions UpdateSession(AIChatSessions session);
    }
}
