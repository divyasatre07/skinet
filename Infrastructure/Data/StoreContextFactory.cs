using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace Infrastructure.Data
{
    public class StoreContextFactory : IDesignTimeDbContextFactory<StoreContext>
    {
        public StoreContext CreateDbContext(string[] args)
        {
            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.Development.json")
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<StoreContext>();

            optionsBuilder.UseSqlServer(
                config.GetConnectionString("DefaultConnection")
            );

            return new StoreContext(optionsBuilder.Options);
        }
    }
}
