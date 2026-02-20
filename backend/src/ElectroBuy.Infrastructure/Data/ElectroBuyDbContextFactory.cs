using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace ElectroBuy.Infrastructure.Data;

public class ElectroBuyDbContextFactory : IDesignTimeDbContextFactory<ElectroBuyDbContext>
{
    public ElectroBuyDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ElectroBuyDbContext>();
        optionsBuilder.UseSqlServer("Server=DESKTOP-AHILKIV\\SQLEXPRESS;Database=ElectroBuy;User Id=sa;Password=elect123456;TrustServerCertificate=True;");

        return new ElectroBuyDbContext(optionsBuilder.Options);
    }
}
