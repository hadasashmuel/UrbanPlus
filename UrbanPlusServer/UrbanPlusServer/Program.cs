// BLL
using BLL;
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
using BLL.Services.ServiceSupport.ImageServices;
using BLL.Services.ServiceSupport.TokenServices;

// DAL
using DAL;
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

// Microsoft
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;

// System
using System.IO;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ====================
// Controllers
// ====================

builder.Services.AddControllers();

// ====================
// Swagger
// ====================

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ====================
// Database
// ====================

var connStr = builder.Configuration.GetConnectionString("SqlServer");

if (string.IsNullOrWhiteSpace(connStr))
{
    throw new InvalidOperationException(
        "Connection string 'SqlServer' is missing or empty. " +
        "Set it with User Secrets or an environment variable.");
}

builder.Services.AddDbContext<UrbanPlusContext>(
    options => options.UseSqlServer(connStr));

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
builder.Services.AddScoped<ITokenService, TokenService>();

// ====================
// Image Service
// ====================

var imagesFolder = builder.Configuration["ImagesFolder"];

if (string.IsNullOrWhiteSpace(imagesFolder))
{
    throw new InvalidOperationException(
        "ImagesFolder is not configured.");
}

var fullImagesFolder = Path.GetFullPath(
    Path.Combine(builder.Environment.ContentRootPath, imagesFolder));

Directory.CreateDirectory(fullImagesFolder);

builder.Services.AddSingleton<IImageService>(
    _ => new ImageService(fullImagesFolder));

// ====================
// AutoMapper
// ====================

builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<MappingProfile>();
});

// ====================
// Password Hasher
// ====================

builder.Services.AddScoped<IPasswordHasher<Users>,
    PasswordHasher<Users>>();

// ====================
// JWT Authentication
// ====================

var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException(
        "Jwt:Key is missing. Set the environment variable Jwt__Key.");
}

if (string.IsNullOrWhiteSpace(jwtIssuer))
{
    throw new InvalidOperationException(
        "Jwt:Issuer is missing. Set the environment variable Jwt__Issuer.");
}

if (string.IsNullOrWhiteSpace(jwtAudience))
{
    throw new InvalidOperationException(
        "Jwt:Audience is missing. Set the environment variable Jwt__Audience.");
}

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,

            ValidateAudience = true,
            ValidAudience = jwtAudience,

            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.FallbackPolicy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
});


var app = builder.Build();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(fullImagesFolder),
    RequestPath = "/images"
});


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
