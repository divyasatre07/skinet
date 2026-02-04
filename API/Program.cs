using Infrastructure.Data;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using API.Middleware;
using StackExchange.Redis;
using Microsoft.VisualBasic;
using System.Data.Common;
using Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<StoreContext>(options =>
{
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    );
});

// Repository
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

// Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
{
    var connString = builder.Configuration.GetConnectionString("Redis")
        ?? throw new Exception("Cannot get redis connection string");

    var options = ConfigurationOptions.Parse(connString);
    options.AbortOnConnectFail = false; // 🔥 VERY IMPORTANT

    return ConnectionMultiplexer.Connect(options);
});


builder.Services.AddSingleton<ICartService, CartService>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy
            .WithOrigins("https://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// 🔥 MUST BE FIRST
app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAngular");

app.UseAuthorization();

app.MapControllers();



app.Run();
