using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using TestWithKendo.DAL;
using TestWithKendo.Entities;
using TestWithKendo.Services;

var builder = WebApplication.CreateBuilder(args);

//var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Add services to the container.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseInMemoryDatabase("AccuAccount_Database"));

builder.Services.AddScoped<AccountStatusListService>();
builder.Services.AddSession();
builder.Services.AddHttpContextAccessor();


builder.Services.AddRazorPages();
var app = builder.Build();

var options = new DbContextOptionsBuilder<ApplicationDbContext>()
    .UseInMemoryDatabase("AccuAccount_Database")
    .Options;

using var context = new ApplicationDbContext(options);
SeedData.PreConfiguraData(context);

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
}

app.UseSession();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();

app.Run();
