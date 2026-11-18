using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Entities
{
    public class UrbanPlusContext : DbContext
    {
        public UrbanPlusContext(DbContextOptions<UrbanPlusContext> options) : base(options)
        {

        }

        public DbSet<Users> Users { get; set; }
        public DbSet<AIChatMessages> AIChatMessages { get; set; }
        public DbSet<AIChatSessions> AIChatSessions { get; set; }
        public DbSet<Badges> Badges { get; set; }
        public DbSet<Categories> Categories { get; set; }
        public DbSet<MainEvents> MainEvents { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Notifications> Notifications { get; set; }

        public DbSet<ReportImages> ReportImages { get; set; }
        public DbSet<Reports> Reports { get; set; }
        public DbSet<SavedEvents> SavedEvents { get; set; }
        public DbSet<UserBadges> UserBadges { get; set; }
        public DbSet<Votes> Votes { get; set; }

        public DbSet<ServiceProviders> ServiceProviders { get; set; }
        public DbSet<WorkTypes> WorkTypes { get; set; }
        public DbSet<ProviderWorkTypes> ProviderWorkTypes { get; set; }
        public DbSet<ReportAssignments> ReportAssignments { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // משתמש לא יכול להצביע פעמיים לאותו אירוע
            modelBuilder.Entity<Votes>()
                .HasIndex(v => new { v.UserId, v.MainEventId })
                .IsUnique();

            // משתמש לא יכול לשמור אותו אירוע פעמיים
            modelBuilder.Entity<SavedEvents>()
                .HasIndex(s => new { s.UserId, s.MainEventId })
                .IsUnique();

            // משתמש לא יכול לקבל את אותו Badge פעמיים
            modelBuilder.Entity<UserBadges>()
                .HasIndex(ub => new { ub.UserId, ub.BadgeId })
                .IsUnique();

            // Email חייב להיות ייחודי
            modelBuilder.Entity<Users>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // מרחק לא יכול להיות שלילי
            modelBuilder.Entity<Notifications>()
                .ToTable("Notifications", table =>
                {
                    table.HasCheckConstraint(
                        "CK_Notifications_DistanceFromEvent_NonNegative",
                        "[DistanceFromEvent] >= 0");
                });

            // מניעת שיוך כפול של אותו ספק לאותו סוג עבודה
            modelBuilder.Entity<ProviderWorkTypes>()
                .HasIndex(p => new { p.ProviderId, p.WorkTypeId })
                .IsUnique();

            // הגדרת קשרי ReportAssignments
            // מניעת מחיקה אוטומטית של רשומות היסטוריית השיוכים
            modelBuilder.Entity<ReportAssignments>()
                .HasOne(a => a.Report)
                .WithMany(r => r.Assignments)
                .HasForeignKey(a => a.ReportId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<ReportAssignments>()
                .HasOne(a => a.ServiceProvider)
                .WithMany(p => p.Assignments)
                .HasForeignKey(a => a.ProviderId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<ReportAssignments>()
                .HasOne(a => a.Manager)
                .WithMany(u => u.ManagedAssignments)
                .HasForeignKey(a => a.ManagerId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<ProviderWorkTypes>()
             .HasOne(p => p.ServiceProvider)
             .WithMany(p => p.ProviderWorkTypes)
            .HasForeignKey(p => p.ProviderId);

            modelBuilder.Entity<ProviderWorkTypes>()
                .HasOne(p => p.WorkType)
                .WithMany(w => w.ProviderWorkTypes)
                .HasForeignKey(p => p.WorkTypeId);
        }
    }

}
