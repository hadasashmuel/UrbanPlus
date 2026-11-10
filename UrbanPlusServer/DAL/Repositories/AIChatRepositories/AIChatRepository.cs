using DAL.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Repositories.AIChatRepositories
{
    public class AIChatRepository : IAIChatRepository
    {
        private readonly UrbanPlusContext _context;

        public AIChatRepository(UrbanPlusContext context)
        {
            _context = context;
        }

        public AIChatSessions CreateSession(AIChatSessions session)
        {
            _context.AIChatSessions.Add(session);
            _context.SaveChanges();

            return session;
        }

        public AIChatSessions? GetSessionById(int sessionId, int userId)
        {
            return _context.AIChatSessions
                .FirstOrDefault(s =>
                    s.AIChatSessionId == sessionId &&
                    s.UserId == userId);
        }

        public List<AIChatMessages> GetMessagesBySession(int sessionId)
        {
            return _context.AIChatMessages
                .Where(m => m.AIChatSessionId == sessionId)
                .OrderBy(m => m.CreatedAt)
                .ToList();
        }

        public AIChatMessages AddMessage(AIChatMessages message)
        {
            _context.AIChatMessages.Add(message);
            _context.SaveChanges();

            return message;
        }

        public AIChatSessions UpdateSession(AIChatSessions session)
        {
            _context.AIChatSessions.Update(session);
            _context.SaveChanges();

            return session;
        }
    }
}
