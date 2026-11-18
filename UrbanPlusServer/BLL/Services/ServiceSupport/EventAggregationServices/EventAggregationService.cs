
using BLL.Services.ServiceSupport.EventAggregationServices;
using DAL.Entities;
using DAL.Repositories.MainEventRepositories;
using System.Text.RegularExpressions;

namespace BLL.Services.ServicesDB.EventAggregationServices
{
    public class EventAggregationService : IEventAggregationService
    {
        private readonly IMainEventRepository _mainEventRepository;

        private const double MaxDistanceMeters = 150;
        private const int TimeWindowHours = 48;

        private const double LocationWeight = 0.8;
        private const double TextWeight = 0.2;
        private const double MinScore = 0.3;

        // מספר אירועים מינימלי לחיזוי לפי חומרה
        private const int MinHistoryForSeverity = 1;

        // תקופת השפעה של נתונים עדכניים
        private const double RecencyPeriodDays = 90;

        public EventAggregationService(
            IMainEventRepository mainEventRepository)
        {
            _mainEventRepository = mainEventRepository;
        }

        public MainEvents FindOrCreateMainEvent(Reports report)
        {
            if (report == null)
                throw new ArgumentNullException(nameof(report));

            var since = DateTime.UtcNow.AddHours(-TimeWindowHours);

            var candidates =
                _mainEventRepository.GetCandidateEvents(
                    report.CategoryId, since);

            MainEvents? bestMatch = null;
            double bestScore = double.MinValue;

            string reportText =
                $"{report.Title} {report.Description}";

            foreach (var candidate in candidates)
            {
                double distance = CalculateDistance(
                    report.Latitude,
                    report.Longitude,
                    candidate.Latitude,
                    candidate.Longitude);

                if (distance > MaxDistanceMeters)
                    continue;

                double textSimilarity = candidate.Reports.Any()
                    ? candidate.Reports.Max(r =>
                        CalculateTextSimilarity(
                            reportText,
                            $"{r.Title} {r.Description}"))
                    : 0;

                double locationScore =
                    1 - (distance / MaxDistanceMeters);

                double totalScore =
                    (locationScore * LocationWeight) +
                    (textSimilarity * TextWeight);

                if (totalScore > bestScore)
                {
                    bestScore = totalScore;
                    bestMatch = candidate;
                }
            }

            if (bestMatch != null && bestScore >= MinScore)
                return bestMatch;

            return CreateNewMainEvent(report);
        }

        private MainEvents CreateNewMainEvent(Reports report)
        {
            string? categoryName =
                _mainEventRepository.GetCategoryName(
                    report.CategoryId);

            string eventTitle =
                $"{categoryName ?? "אירוע"} - {report.InputAddress}";

            // קביעת חומרה אוטומטית לפי הקטגוריה
            var severity =
                GetSeverityByCategory(report.CategoryId);

            // חישוב זמן טיפול משוער לפי היסטוריית אירועים
            int estimatedMinutes =
                CalculateEstimatedResolutionMinutes(
                    report.CategoryId,
                    severity);

            return _mainEventRepository.AddMainEvent(new MainEvents
            {
                CategoryId = report.CategoryId,
                Title = Truncate(eventTitle, 80),
                Status = EventStatus.New,
                Latitude = report.Latitude,
                Longitude = report.Longitude,
                Address = Truncate(report.InputAddress, 100),
                Severity = severity,
                EstimatedResolutionMinutes = estimatedMinutes,
                CreatedAt = report.CreatedAt
            });
        }

        // ==========================================
        // קביעת חומרה לפי קטגוריה
        // ==========================================

        private static Severity GetSeverityByCategory(int categoryId)
        {
            return categoryId switch
            {
                1 => Severity.High,     // בור בכביש
                2 => Severity.Low,      // תאורה מקולקלת
                3 => Severity.Low,      // פח אשפה
                4 => Severity.Low,      // מדרכה שבורה
                5 => Severity.High,     // עץ מסוכן
                6 => Severity.High,     // פיצוץ בצנרת
                7 => Severity.High,     // מפגעי תנועה
                8 => Severity.Low,      // גרפיטי והשחתה
                9 => Severity.High,     // מפגעי בנייה
                10 => Severity.Low,     // מפגעים תברואתיים
                11 => Severity.High,    // מפגעים בכביש
                12 => Severity.Low,     // מתקנים ציבוריים
                13 => Severity.Critical,// שריפה

                _ => Severity.Low
            };
        }

        // ==========================================
        // אלגוריתם חיזוי זמן טיפול
        // ==========================================

        private int CalculateEstimatedResolutionMinutes(
            int categoryId,
            Severity severity)
        {
            var history =
                _mainEventRepository.GetHistoricalTreatedEvents(
                    categoryId);

            history = history
                .Where(e =>
                    e.ActualResolutionMinutes.HasValue &&
                    e.ActualResolutionMinutes.Value > 0)
                .ToList();

            // אין היסטוריה - משתמשים בברירת מחדל
            if (history.Count == 0)
                return GetDefaultResolutionMinutes(severity);

            var sameSeverity = history
                .Where(e => e.Severity == severity)
                .ToList();

            // אם יש היסטוריה באותה חומרה,
            // משתמשים בה בלבד
            var relevantEvents =
                sameSeverity.Count >= MinHistoryForSeverity
                    ? sameSeverity
                    : history;

            double weightedTotal = 0;
            double totalWeight = 0;

            foreach (var historicalEvent in relevantEvents)
            {
                double actualMinutes =
                    historicalEvent.ActualResolutionMinutes!.Value;

                // אותה חומרה מקבלת משקל מלא
                double severityWeight =
                    historicalEvent.Severity == severity
                        ? 1.0
                        : 0.5;

                // אירועים חדשים מקבלים משקל גבוה יותר
                double daysAgo = historicalEvent.ResolvedAt.HasValue
                    ? Math.Max(
                        0,
                        (DateTime.UtcNow -
                         historicalEvent.ResolvedAt.Value).TotalDays)
                    : 365;

                double recencyWeight =
                    1.0 / (1.0 + daysAgo / RecencyPeriodDays);

                double weight =
                    severityWeight * recencyWeight;

                weightedTotal += actualMinutes * weight;
                totalWeight += weight;
            }

            if (totalWeight <= 0)
                return GetDefaultResolutionMinutes(severity);

            int estimatedMinutes =
                (int)Math.Round(weightedTotal / totalWeight);

            return Math.Max(1, estimatedMinutes);
        }

        // ==========================================
        // זמני ברירת מחדל לפי חומרה
        // ==========================================

        private static int GetDefaultResolutionMinutes(
            Severity severity)
        {
            return severity switch
            {
                Severity.Low => 360,
                Severity.Medium => 120,
                Severity.High => 60,
                Severity.Critical => 30,
                _ => 120
            };
        }

        // ==========================================
        // חישוב מרחק גיאוגרפי
        // ==========================================

        private static double CalculateDistance(
            double lat1, double lon1,
            double lat2, double lon2)
        {
            const double earthRadius = 6371000;

            double dLat = ToRadians(lat2 - lat1);
            double dLon = ToRadians(lon2 - lon1);

            double a =
                Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(ToRadians(lat1)) *
                Math.Cos(ToRadians(lat2)) *
                Math.Sin(dLon / 2) *
                Math.Sin(dLon / 2);

            double c = 2 * Math.Atan2(
                Math.Sqrt(a),
                Math.Sqrt(1 - a));

            return earthRadius * c;
        }

        private static double ToRadians(double degrees)
        {
            return degrees * Math.PI / 180;
        }

        // ==========================================
        // בדיקת דמיון טקסטואלי
        // ==========================================

        private static double CalculateTextSimilarity(
            string? text1, string? text2)
        {
            var words1 = GetWords(text1);
            var words2 = GetWords(text2);

            if (words1.Count == 0 || words2.Count == 0)
                return 0;

            int intersection =
                words1.Intersect(words2).Count();

            int union =
                words1.Union(words2).Count();

            return union == 0
                ? 0
                : (double)intersection / union;
        }

        private static HashSet<string> GetWords(string? text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return new HashSet<string>();

            return Regex.Matches(
                    text.ToLowerInvariant(),
                    @"[\p{L}\p{N}]+")
                .Select(m => m.Value)
                .Where(word => word.Length > 1)
                .ToHashSet();
        }

        // ==========================================
        // קיצור טקסט
        // ==========================================

        private static string? Truncate(
            string? value, int maxLength)
        {
            if (string.IsNullOrWhiteSpace(value))
                return value;

            return value.Length <= maxLength
                ? value
                : value[..maxLength];
        }
    }
}
