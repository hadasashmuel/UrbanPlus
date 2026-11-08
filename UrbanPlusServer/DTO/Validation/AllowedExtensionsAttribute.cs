using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;


namespace DTO.Validation
{
    public class AllowedExtensionsAttribute : ValidationAttribute
    {
        private readonly string[] _extensions;

        public AllowedExtensionsAttribute(params string[] extensions)
        {
            _extensions = extensions;
        }

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value is IFormFile file)
            {
                var ext = Path.GetExtension(file.FileName).ToLower();
                if (!_extensions.Contains(ext))
                    return new ValidationResult($"Only the following file types are allowed: {string.Join(", ", _extensions)}");
            }

            // אין קובץ? מבחינתנו זה תקין. אם הוא חובה, זה התפקיד של [Required]
            return ValidationResult.Success;
        }
    }
}
