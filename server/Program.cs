using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using ChatApp.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5125); 
    options.ListenAnyIP(7193, listenOptions =>
    {
        listenOptions.UseHttps(); 
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
    {
        builder.WithOrigins("http://localhost:3000") 
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

builder.Services.AddSignalR();

var app = builder.Build();

app.UseHttpsRedirection(); 
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();
app.UseCors("CorsPolicy");

app.MapHub<ChatHub>("/chathub");

app.Run();
