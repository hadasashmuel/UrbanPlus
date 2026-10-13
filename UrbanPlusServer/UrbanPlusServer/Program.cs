using BLL;
using BLL.Repositories.BadgeRepositories;
using BLL.Repositories.CategoryRepositories;
using BLL.Repositories.MessageRepositories;
using BLL.Repositories.NotificationRepositories;
using BLL.Repositories.ReportRepositories;
using BLL.Repositories.SaveEventRepositories;
using BLL.Repositories.UserBadgeRepositories;
using BLL.Repositories.UserRepositories;
using BLL.Repositories.VoteRepositories;
using DAL;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Services
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddDbContext<UrbanPlusContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("SqlServer")
    ));

// Repositories
builder.Services.AddScoped<IBadgeRepositories, BadgeRepositories>();
builder.Services.AddScoped<ICategoryRepositories, CategoryRepositories>();
//builder.Services.AddScoped<IMainEventRepositories, MainEventRepositories>();
builder.Services.AddScoped<IMessageRepositories, MessageRepositories>();
builder.Services.AddScoped<INotificationRepositories, NotificationRepositories>();
builder.Services.AddScoped<IReportRepositories, ReportRepositories>();
builder.Services.AddScoped<ISaveEventRepositories,SaveEventRepositories>();
builder.Services.AddScoped<IUserBadgeRepositories, UserBadgeRepositories>();
builder.Services.AddScoped<IUserRepositories, UserRepositories>();
builder.Services.AddScoped<IVoteRepositories, VoteRepositories>();
builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<MappingProfile>();
});
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();