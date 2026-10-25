using BLL.Services.ServiceSupport;
using Microsoft.AspNetCore.Http;

namespace BLL.Services.ImageServices
{
    public class ImageService : IImageService
    {
        private readonly string _folder;

        public ImageService(string folder)
        {
            _folder = folder;
            Directory.CreateDirectory(_folder);
        }

        public string Save(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("לא נבחר קובץ.");

            // בדיקת סוג הקובץ
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();

            var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp" };

            if (!allowed.Contains(ext))
                throw new ArgumentException(
                    "מותר להעלות רק קובצי JPG, PNG או WEBP.");

            // בדיקת גודל: עד 5MB
            if (file.Length > 5 * 1024 * 1024)
                throw new ArgumentException("הקובץ גדול מדי. המקסימום הוא 5MB.");

            // יצירת שם ייחודי
            var fileName = $"{Guid.NewGuid()}{ext}";
            var path = Path.Combine(_folder, fileName);

            using (var stream = File.Create(path))
            {
                file.CopyTo(stream);
            }

            // מחזירים את שם הקובץ בלבד
            return fileName;
        }

        public void Delete(string fileName)
        {
            if (string.IsNullOrWhiteSpace(fileName))
                return;

            // מונע שימוש בנתיב שמגיע מבחוץ
            var safeFileName = Path.GetFileName(fileName);

            if (safeFileName != fileName)
                throw new ArgumentException("שם קובץ לא תקין.");

            var path = Path.Combine(_folder, safeFileName);

            if (File.Exists(path))
                File.Delete(path);
        }
    }
}
