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
                var adminPassword = configuration["Seed:Admin:Password"] ?? Environment.GetEnvironmentVariable("SEED_ADMIN_PASSWORD");
                var adminRole = configuration["Seed:Admin:Role"] ?? Environment.GetEnvironmentVariable("SEED_ADMIN_ROLE") ?? "Admin";

                var userUsername = configuration["Seed:User:Username"] ?? Environment.GetEnvironmentVariable("SEED_USER_USERNAME") ?? "user";
                var userPassword = configuration["Seed:User:Password"] ?? Environment.GetEnvironmentVariable("SEED_USER_PASSWORD");
                var userRole = configuration["Seed:User:Role"] ?? Environment.GetEnvironmentVariable("SEED_USER_ROLE") ?? "User";


                var admin = await context.Users.FirstOrDefaultAsync(u => u.Username == adminUsername);
                if (admin == null)
                {
                    if (string.IsNullOrWhiteSpace(adminPassword))
                    {
                        logger?.LogWarning("Admin user not created: no password provided for '{Username}'. Provide it via configuration (Seed:Admin:Password) or environment variable SEED_ADMIN_PASSWORD.", adminUsername);
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
                        logger?.LogInformation("Created admin user '{Username}' with role '{Role}'.", adminUsername, adminRole);
                    }
                }
                else
                {
                    var changed = false;
                    if (admin.Role != adminRole)
                    {
                        admin.Role = adminRole;
                        changed = true;
                    }

                    if (!string.IsNullOrWhiteSpace(adminPassword) && !UserService.VerifyPassword(adminPassword, admin.PasswordHash))
                    {
                        admin.PasswordHash = UserService.HashPassword(adminPassword);
                        changed = true;
                        logger?.LogInformation("Updated admin password for '{Username}'.", adminUsername);
                    }

                    if (changed)
                    {
                        context.Users.Update(admin);
                        await context.SaveChangesAsync();
                        logger?.LogInformation("Updated admin user '{Username}'.", adminUsername);
                    }
                }

                var standard = await context.Users.FirstOrDefaultAsync(u => u.Username == userUsername);
                if (standard == null)
                {
                    if (string.IsNullOrWhiteSpace(userPassword))
                    {
                        logger?.LogWarning("Standard user not created: no password provided for '{Username}'. Provide it via configuration (Seed:User:Password) or environment variable SEED_USER_PASSWORD.", userUsername);
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
                        logger?.LogInformation("Created standard user '{Username}' with role '{Role}'.", userUsername, userRole);
                    }
                }
                else
                {
                    var changed = false;
                    if (standard.Role != userRole)
                    {
                        standard.Role = userRole;
                        changed = true;
                    }

                    if (!string.IsNullOrWhiteSpace(userPassword) && !UserService.VerifyPassword(userPassword, standard.PasswordHash))
                    {
                        standard.PasswordHash = UserService.HashPassword(userPassword);
                        changed = true;
                        logger?.LogInformation("Updated standard user password for '{Username}'.", userUsername);
                    }

                    if (changed)
                    {
                        context.Users.Update(standard);
                        await context.SaveChangesAsync();
                        logger?.LogInformation("Updated standard user '{Username}'.", userUsername);
                    }
                }
            }
            catch (Exception ex)
            {
                logger?.LogError(ex, "Error running data seed.");
                
            }
        }
    }
}
