using BLL.Services.ServiceSupport.EventAggregationServices;
using DAL.Entities;
using DAL.Repositories.MainEventRepositories;
using System.Text.RegularExpressions;

namespace BLL.Services.ServicesDB.EventAggregationServices
{
    public class EventAggregationService : IEventAggregationService
    {
        private readonly IMainEventRepository _mainEventRepository;

        // רדיוס מקסימלי: אירוע רחוק מזה נפסל לגמרי
        private const double MaxDistanceMeters = 150;

        // חלון הזמן לחיפוש אירועים קיימים
        private const int TimeWindowHours = 48;

        // המיקום הוא הגורם המרכזי, הטקסט רק משפר דירוג
        private const double LocationWeight = 0.8;
        private const double TextWeight = 0.2;

        // סף מינימלי נמוך: מונע איחוד של דיווחים רחוקים וגם לא דומים בכלל
        // (עם הערכים האלה: בלי דמיון טקסט, איחוד עד כ-94 מטר)
        private const double MinScore = 0.3;

        public EventAggregationService(
            IMainEventRepository mainEventRepository)
        {
            _mainEventRepository = mainEventRepository;
        }

        public MainEvents FindOrCreateMainEvent(Reports report)
        {
            if (report == null)
                throw new ArgumentNullException(nameof(report));

            // 1. אירועים באותה קטגוריה ב-48 השעות האחרונות
            var since = DateTime.UtcNow.AddHours(-TimeWindowHours);

            var candidates =
                _mainEventRepository.GetCandidateEvents(
                    report.CategoryId, since);

            MainEvents? bestMatch = null;
            double bestScore = double.MinValue;

            string reportText = $"{report.Title} {report.Description}";

            foreach (var candidate in candidates)
            {
                // 2. מרחק GPS
                double distance = CalculateDistance(
                    report.Latitude,
                    report.Longitude,
                    candidate.Latitude,
                    candidate.Longitude);

                if (distance > MaxDistanceMeters)
                    continue;

                // 3. דמיון טקסט מול הדיווח הכי דומה באירוע
                //    (ולא מול שרשור של כל הדיווחים, שמקטין את הדמיון ככל שהאירוע גדל)
                double textSimilarity = candidate.Reports.Any()
                    ? candidate.Reports.Max(r =>
                        CalculateTextSimilarity(
                            reportText,
                            $"{r.Title} {r.Description}"))
                    : 0;

                // 4. ציון התאמה
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

            // 5. שיוך לאירוע המתאים ביותר, או יצירת אירוע חדש
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

            return _mainEventRepository.AddMainEvent(new MainEvents
            {
                CategoryId = report.CategoryId,
                Title = Truncate(eventTitle, 80),
                Status = EventStatus.New,
                Latitude = report.Latitude,
                Longitude = report.Longitude,
                Address = Truncate(report.InputAddress, 100),
                Severity = Severity.Medium,
                EstimatedResolutionMinutes = 0,
                CreatedAt = report.CreatedAt
            });
        }

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