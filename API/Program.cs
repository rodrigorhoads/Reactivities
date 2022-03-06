using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            IHost host = CreateHostBuilder(args).Build();

            using IServiceScope scope = host.Services.CreateScope();

            IServiceProvider services = scope.ServiceProvider;

            try
            {
                //garante que a migration vai ser aplicada
                DataContext context = services.GetRequiredService<DataContext>();
                await context.Database.MigrateAsync();
                await Seed.SeedData(context);
            }
            catch (Exception ex)
            {
                var logger = services.GetRequiredService<ILogger<Program>>();
                logger.LogError(ex, "Um erro ocorreu durante a migration");
            }

           await host.RunAsync();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
