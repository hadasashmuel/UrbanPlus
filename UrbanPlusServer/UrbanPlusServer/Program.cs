//BLL
using BLL;
using BLL.Services.ImageServices;
using BLL.Services.ServicesDB.BadgeServices;
using BLL.Services.ServicesDB.CategoryServices;
using BLL.Services.ServicesDB.MainEventServices;
using BLL.Services.ServicesDB.MessageServices;
using BLL.Services.ServicesDB.NotificationServices;
using BLL.Services.ServicesDB.ReportImagesServices;
using BLL.Services.ServicesDB.ReportServices;
using BLL.Services.ServicesDB.SaveEventServices;
using BLL.Services.ServicesDB.UserBadgeServices;
using BLL.Services.ServicesDB.UserServices;
using BLL.Services.ServicesDB.VoteServices;
using BLL.Services.ServiceSupport;
//DAL
using DAL.Entities;
using DAL.Repositories.BadgeRepositories;
using DAL.Repositories.CategoryRepositories;
using DAL.Repositories.MainEventRepositories;
using DAL.Repositories.MessageRepositories;
using DAL.Repositories.NotificationRepositories;
using DAL.Repositories.ReportImageRepositories;
using DAL.Repositories.ReportRepositories;
using DAL.Repositories.SaveEventRepositories;
using DAL.Repositories.UserBadgeRepositories;
using DAL.Repositories.UserRepositories;
using DAL.Repositories.VoteRepositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database

var connStr = builder.Configuration.GetConnectionString("SqlServer");

if (string.IsNullOrWhiteSpace(connStr))
{
    throw new InvalidOperationException(
        "Connection string 'SqlServer' is missing or empty. " +
        "Set it with User Secrets or an environment variable.");
}

builder.Services.AddDbContext<UrbanPlusContext>(o => o.UseSqlServer(connStr));

// ====================
// Repositories (DAL)
// ====================

builder.Services.AddScoped<IBadgeRepository, BadgeRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IMainEventRepository, MainEventRepository>();
builder.Services.AddScoped<IMessageRepository, MessageRepository>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
builder.Services.AddScoped<IReportImageRepository, ReportImageRepository>();
builder.Services.AddScoped<IReportRepository, ReportRepository>();
builder.Services.AddScoped<ISaveEventRepository, SaveEventRepository>();
builder.Services.AddScoped<IUserBadgeRepository, UserBadgeRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IVoteRepository, VoteRepository>();

// ====================
// Services (BLL)
// ====================

builder.Services.AddScoped<IBadgeService, BadgeService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IMainEventService, MainEventService>();
builder.Services.AddScoped<IMessageService, MessageService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IReportImageService, ReportImageService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<ISaveEventService, SaveEventService>();
builder.Services.AddScoped<IUserBadgeService, UserBadgeService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IVoteService, VoteService>();

string imagesFolder = builder.Configuration["ImagesFolder"]
    ?? throw new InvalidOperationException("ImagesFolder is not configured.");

builder.Services.AddSingleton<IImageService>(
    _ => new ImageService(imagesFolder));
// ====================
// AutoMapper
// ====================

builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<MappingProfile>();
});


var imageFolder = builder.Configuration["ImageSettings:Folder"];

if (string.IsNullOrWhiteSpace(imageFolder))
{
    throw new InvalidOperationException(
        "Image folder path is missing in appsettings.json.");
}

var fullImageFolder = Path.GetFullPath(
    Path.Combine(builder.Environment.ContentRootPath, imageFolder));

builder.Services.AddSingleton<IImageService>(
    _ => new ImageService(fullImageFolder));

var app = builder.Build();


app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(imagesFolder),
    RequestPath = "/images"
});

// Swagger UI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
