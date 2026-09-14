using DAL;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// שליפת מחרוזת החיבור לפי השם SqlServer המוגדר ב-appsettings.json
var connectionString = builder.Configuration.GetConnectionString("SqlServer");

// רישום ה-DbContext עם Connection String
builder.Services.AddDbContext<UrbanPlusContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();