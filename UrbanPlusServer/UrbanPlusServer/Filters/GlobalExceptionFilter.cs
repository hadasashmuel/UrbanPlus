using BLL.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace UrbanPlusServer.Filters
{
    public class GlobalExceptionFilter : IExceptionFilter
    {
        private readonly ILogger<GlobalExceptionFilter> _logger;

        public GlobalExceptionFilter(ILogger<GlobalExceptionFilter> logger)
        {
            _logger = logger;
        }

        public void OnException(ExceptionContext context)
        {
            var ex = context.Exception;

            // 1. רישום ללוג, עם כל הפרטים
            _logger.LogError(ex, "Unhandled exception at {Path}", context.HttpContext.Request.Path);

            // 2. בחירת קוד סטטוס לפי סוג החריגה
            int status = ex switch
            {
                NotFoundException => StatusCodes.Status404NotFound,
                ConflictException => StatusCodes.Status409Conflict,
                BusinessRuleException => StatusCodes.Status400BadRequest,
                ArgumentException => StatusCodes.Status400BadRequest,
                _ => StatusCodes.Status500InternalServerError
            };

            // 3. ההודעה ללקוח: בשגיאה לא צפויה לא חושפים פרטים
            string message = status == 500
                ? "An unexpected error occurred. Please try again later."
                : ex.Message;

            // 4. בניית התשובה
            context.Result = new ObjectResult(new ProblemDetails
            {
                Status = status,
                Title = message
            })
            {
                StatusCode = status
            };

            // 5. סימון שהשגיאה טופלה
            context.ExceptionHandled = true;
        }
    }
}
