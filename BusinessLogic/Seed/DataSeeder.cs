using System;
using System.Threading.Tasks;
using DataAccess;
using Entitys.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using BusinessLogic.Services;

namespace BusinessLogic.Seed
{
    public static class DataSeeder
    {
        public static async Task SeedAsync(IServiceProvider serviceProvider, IConfiguration configuration, ILogger? logger = null)
        {
            try
            {
                var context = serviceProvider.GetRequiredService<ApplicationDbContext>();

                var adminUsername = configuration["Seed:Admin:Username"] ?? Environment.GetEnvironmentVariable("SEED_ADMIN_USERNAME") ?? "admin";
                var adminPassword = configuration["Seed:Admin:Password"] ?? Environment.GetEnvironmentVariable("SEED_ADMIN_PASSWORD") ?? "admin123";
                var adminRole = configuration["Seed:Admin:Role"] ?? Environment.GetEnvironmentVariable("SEED_ADMIN_ROLE") ?? "SuperAdmin";

                var userUsername = configuration["Seed:User:Username"] ?? Environment.GetEnvironmentVariable("SEED_USER_USERNAME") ?? "user";
                var userPassword = configuration["Seed:User:Password"] ?? Environment.GetEnvironmentVariable("SEED_USER_PASSWORD") ?? "user123";
                var userRole = configuration["Seed:User:Role"] ?? Environment.GetEnvironmentVariable("SEED_USER_ROLE") ?? "User";

                var admin = await context.Users.FirstOrDefaultAsync(u => u.Username == adminUsername);
                if (admin == null)
                {
                    if (string.IsNullOrWhiteSpace(adminPassword))
                    {
                        logger?.LogWarning("Usuario administrador no creado: no se proporcionó contraseña para '{Username}'. Proporciónela mediante la configuración (Seed:Admin:Password) o la variable de entorno SEED_ADMIN_PASSWORD.", adminUsername);
                    }
                    else
                    {
                        admin = new User
                        {
                            Username = adminUsername,
                            PasswordHash = UserService.HashPassword(adminPassword),
                            Role = adminRole,
                            CreatedAt = DateTime.UtcNow
                        };

                        context.Users.Add(admin);
                        await context.SaveChangesAsync();
                        logger?.LogInformation("Usuario administrador '{Username}' creado con rol '{Role}'.", adminUsername, adminRole);
                    }
                }
                else
                {
                    var changed = false;
          

                    if (!string.IsNullOrWhiteSpace(adminPassword) && !UserService.VerifyPassword(adminPassword, admin.PasswordHash))
                    {
                        admin.PasswordHash = UserService.HashPassword(adminPassword);
                        changed = true;
                        logger?.LogInformation("Contraseña del administrador actualizada para '{Username}'.", adminUsername);
                    }

                    if (changed)
                    {
                        context.Users.Update(admin);
                        await context.SaveChangesAsync();
                        logger?.LogInformation("Usuario administrador '{Username}' actualizado.", adminUsername);
                    }
                }

                var standard = await context.Users.FirstOrDefaultAsync(u => u.Username == userUsername);
                if (standard == null)
                {
                    if (string.IsNullOrWhiteSpace(userPassword))
                    {
                        logger?.LogWarning("Usuario estándar no creado: no se proporcionó contraseña para '{Username}'. Proporciónela mediante la configuración (Seed:User:Password) o la variable de entorno SEED_USER_PASSWORD.", userUsername);
                    }
                    else
                    {
                        standard = new User
                        {
                            Username = userUsername,
                            PasswordHash = UserService.HashPassword(userPassword),
                            Role = userRole,
                            CreatedAt = DateTime.UtcNow
                        };

                        context.Users.Add(standard);
                        await context.SaveChangesAsync();
                        logger?.LogInformation("Usuario estándar '{Username}' creado con rol '{Role}'.", userUsername, userRole);
                    }
                }
                else
                {
                    var changed = false;
                   

                    if (!string.IsNullOrWhiteSpace(userPassword) && !UserService.VerifyPassword(userPassword, standard.PasswordHash))
                    {
                        standard.PasswordHash = UserService.HashPassword(userPassword);
                        changed = true;
                        logger?.LogInformation("Contraseña del usuario estándar actualizada para '{Username}'.", userUsername);
                    }

                    if (changed)
                    {
                        context.Users.Update(standard);
                        await context.SaveChangesAsync();
                        logger?.LogInformation("Usuario estándar '{Username}' actualizado.", userUsername);
                    }
                }
            }
            catch (Exception ex)
            {
                logger?.LogError(ex, "Error al ejecutar la inicialización de datos.");
            }
        }
    }
}
