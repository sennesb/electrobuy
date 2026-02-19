using Microsoft.EntityFrameworkCore;

namespace ElectroBuy.Infrastructure.Data;

public class ElectroBuyDbContext : DbContext
{
    public ElectroBuyDbContext(DbContextOptions<ElectroBuyDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
    }
}
