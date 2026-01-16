using Infrastructure.Data;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ✅ Database
builder.Services.AddDbContext<StoreContext>(options =>
{
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    );
});

// ✅ Repository registration (THIS FIXES THE ERROR)
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

// services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ✅ CORS
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

// middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// ✅ CORS must be before controllers
app.UseCors("AllowAngular");

app.UseAuthorization();
app.MapControllers();

app.Run();
