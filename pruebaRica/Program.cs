using BusinessLogic.Services;
using BusinessLogic.Services.Interface;
using DataAccess;
using DataAccess.Repositories;
using DataAccess.Repositories.Interface;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"] ?? "RicaInventorySuperSecretSecurityKey12345!!!");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"] ?? "RicaInventoryAPI",
        ValidAudience = jwtSettings["Audience"] ?? "RicaInventoryClient",
        IssuerSigningKey = new SymmetricSecurityKey(key),
        // Ensure the role claim is read from the JWT using the standard role claim type
        RoleClaimType = System.Security.Claims.ClaimTypes.Role,
        NameClaimType = System.Security.Claims.ClaimTypes.Name,
        ClockSkew = TimeSpan.Zero
    };

    options.Events = new JwtBearerEvents
    {
        OnChallenge = context =>
        {
            context.HandleResponse();
            context.Response.StatusCode = Microsoft.AspNetCore.Http.StatusCodes.Status401Unauthorized;
            context.Response.ContentType = "application/json";
            var responseJson = System.Text.Json.JsonSerializer.Serialize(new
            {
                message = "No autorizado. Token inválido, expirado o ausente."
            });
            return context.Response.WriteAsync(responseJson);
        },
        OnForbidden = context =>
        {
            context.Response.StatusCode = Microsoft.AspNetCore.Http.StatusCodes.Status403Forbidden;
            context.Response.ContentType = "application/json";
            var responseJson = System.Text.Json.JsonSerializer.Serialize(new
            {
                message = "Acceso denegado. Se requieren permisos de Administrador."
            });
            return context.Response.WriteAsync(responseJson);
        }
    };
});

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IProductService, ProductService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // React client Vite port
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddOpenApi();

var app = builder.Build();

app.UseHttpsRedirection();
app.MapOpenApi();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/openapi/v1.json", "Rica API V1");
    options.RoutePrefix = "swagger";
});

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();

        var adminUser = context.Users.FirstOrDefault(u => u.Username == "admin");
        if (adminUser != null)
        {
            adminUser.PasswordHash = UserService.HashPassword("admin123");
            context.Users.Update(adminUser);
        }

        var standardUser = context.Users.FirstOrDefault(u => u.Username == "user");
        if (standardUser != null)
        {
            standardUser.PasswordHash = UserService.HashPassword("user123");
            context.Users.Update(standardUser);
        }

        if (adminUser != null || standardUser != null)
        {
            context.SaveChanges();
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error seeding password hashes: {ex.Message}");
    }
}

app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/health", () => Results.Ok(new { status = "Healthy" }));

app.MapGet("/", () => Results.Redirect("/swagger"));

app.Run();
