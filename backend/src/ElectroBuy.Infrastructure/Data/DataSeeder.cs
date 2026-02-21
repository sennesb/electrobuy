using ElectroBuy.Domain.Entities;
using ElectroBuy.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace ElectroBuy.Infrastructure.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(ElectroBuyDbContext context)
    {
        await SeedCategoriesAsync(context);
        await SeedProductsAsync(context);
        await SeedAdminUserAsync(context);
    }

    private static async Task SeedCategoriesAsync(ElectroBuyDbContext context)
    {
        if (await context.Categories.AnyAsync())
        {
            return;
        }

        var categories = new List<Category>
        {
            new Category
            {
                Name = "PLC可编程控制器",
                Description = "可编程逻辑控制器，用于工业自动化控制",
                SortOrder = 1,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new Category
            {
                Name = "变频器",
                Description = "变频调速器，用于电机速度控制",
                SortOrder = 2,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new Category
            {
                Name = "传感器",
                Description = "各类工业传感器，包括温度、压力、位置等",
                SortOrder = 3,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new Category
            {
                Name = "低压电器",
                Description = "断路器、接触器、继电器等低压电气设备",
                SortOrder = 4,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new Category
            {
                Name = "人机界面",
                Description = "触摸屏、工控机等人机交互设备",
                SortOrder = 5,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new Category
            {
                Name = "伺服系统",
                Description = "伺服电机、伺服驱动器等运动控制设备",
                SortOrder = 6,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new Category
            {
                Name = "工业通信",
                Description = "工业以太网交换机、串口服务器等通信设备",
                SortOrder = 7,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new Category
            {
                Name = "电源与配电",
                Description = "开关电源、UPS、配电柜等电源设备",
                SortOrder = 8,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            }
        };

        await context.Categories.AddRangeAsync(categories);
        await context.SaveChangesAsync();
    }

    private static async Task SeedProductsAsync(ElectroBuyDbContext context)
    {
        if (await context.Products.AnyAsync())
        {
            return;
        }

        var categories = await context.Categories.ToDictionaryAsync(c => c.Name, c => c.Id);

        var products = new List<Product>
        {
            new Product
            {
                Name = "西门子 S7-1200 CPU 1214C DC/DC/DC",
                ModelNumber = "6ES7214-1AG40-0XB0",
                CategoryId = categories["PLC可编程控制器"],
                Brand = "西门子",
                Price = 3500.00m,
                Unit = "台",
                Stock = 50,
                MinOrderQty = 1,
                Specs = "{\"CPU类型\":\"1214C\",\"工作存储器\":\"100KB\",\"数字量输入\":\"14\",\"数字量输出\":\"10\",\"模拟量输入\":\"2\",\"通信接口\":\"PROFINET\"}",
                Description = "SIMATIC S7-1200 CPU 1214C 紧凑型CPU，DC/DC/DC，14DI/10DO/2AI，集成PROFINET接口",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "西门子 S7-1200 CPU 1215C DC/DC/DC",
                ModelNumber = "6ES7215-1AG40-0XB0",
                CategoryId = categories["PLC可编程控制器"],
                Brand = "西门子",
                Price = 4800.00m,
                Unit = "台",
                Stock = 30,
                MinOrderQty = 1,
                Specs = "{\"CPU类型\":\"1215C\",\"工作存储器\":\"125KB\",\"数字量输入\":\"14\",\"数字量输出\":\"10\",\"模拟量输入\":\"2\",\"模拟量输出\":\"2\",\"通信接口\":\"PROFINET x2\"}",
                Description = "SIMATIC S7-1200 CPU 1215C 紧凑型CPU，DC/DC/DC，14DI/10DO/2AI/2AO，双PROFINET接口",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "三菱 FX5U-32MT/ES",
                ModelNumber = "FX5U-32MT/ES",
                CategoryId = categories["PLC可编程控制器"],
                Brand = "三菱",
                Price = 2800.00m,
                Unit = "台",
                Stock = 40,
                MinOrderQty = 1,
                Specs = "{\"CPU类型\":\"FX5U\",\"输入点数\":\"16\",\"输出点数\":\"16\",\"输出类型\":\"晶体管\",\"通信接口\":\"以太网、RS-485\"}",
                Description = "MELSEC iQ-F FX5U PLC，32点晶体管输出，内置以太网",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "西门子 SINAMICS G120C 变频器 0.75kW",
                ModelNumber = "6SL3210-1KE13-8UF2",
                CategoryId = categories["变频器"],
                Brand = "西门子",
                Price = 2200.00m,
                Unit = "台",
                Stock = 25,
                MinOrderQty = 1,
                Specs = "{\"功率\":\"0.75kW\",\"额定电流\":\"2.1A\",\"输入电压\":\"380V\",\"控制方式\":\"V/F、矢量\"}",
                Description = "SINAMICS G120C 紧凑型变频器，0.75kW，380V",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "西门子 SINAMICS G120C 变频器 2.2kW",
                ModelNumber = "6SL3210-1KE14-3UF2",
                CategoryId = categories["变频器"],
                Brand = "西门子",
                Price = 3200.00m,
                Unit = "台",
                Stock = 20,
                MinOrderQty = 1,
                Specs = "{\"功率\":\"2.2kW\",\"额定电流\":\"5.0A\",\"输入电压\":\"380V\",\"控制方式\":\"V/F、矢量\"}",
                Description = "SINAMICS G120C 紧凑型变频器，2.2kW，380V",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "ABB ACS510 变频器 3kW",
                ModelNumber = "ACS510-01-03A3-4",
                CategoryId = categories["变频器"],
                Brand = "ABB",
                Price = 4500.00m,
                Unit = "台",
                Stock = 15,
                MinOrderQty = 1,
                Specs = "{\"功率\":\"3kW\",\"额定电流\":\"7.6A\",\"输入电压\":\"380V\",\"控制方式\":\"标量、矢量\"}",
                Description = "ABB ACS510 通用型变频器，3kW，380V，内置EMC滤波器",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "西门子 SITRANS P 压力变送器",
                ModelNumber = "7MF1565-3AA00-1AA1",
                CategoryId = categories["传感器"],
                Brand = "西门子",
                Price = 1800.00m,
                Unit = "台",
                Stock = 60,
                MinOrderQty = 1,
                Specs = "{\"测量范围\":\"0-10bar\",\"精度\":\"0.25%\",\"输出信号\":\"4-20mA\",\"过程连接\":\"G1/2\"}",
                Description = "SITRANS P 压力变送器，0-10bar，4-20mA输出",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "西门子 SITRANS TS500 温度变送器",
                ModelNumber = "7NG3210-0KA00",
                CategoryId = categories["传感器"],
                Brand = "西门子",
                Price = 950.00m,
                Unit = "台",
                Stock = 80,
                MinOrderQty = 1,
                Specs = "{\"传感器类型\":\"Pt100\",\"测量范围\":\"-200~850°C\",\"输出信号\":\"4-20mA\",\"精度\":\"0.1%\"}",
                Description = "SITRANS TS500 温度变送器，Pt100输入，4-20mA输出",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "倍加福 NBN15-30GM50-E0 电感式接近开关",
                ModelNumber = "NBN15-30GM50-E0",
                CategoryId = categories["传感器"],
                Brand = "倍加福",
                Price = 280.00m,
                Unit = "个",
                Stock = 200,
                MinOrderQty = 10,
                Specs = "{\"检测距离\":\"15mm\",\"输出类型\":\"常开\",\"工作电压\":\"10-30VDC\",\"防护等级\":\"IP67\"}",
                Description = "倍加福电感式接近开关，M30规格，15mm检测距离",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "西门子 3RT2026-1BB40 接触器",
                ModelNumber = "3RT2026-1BB40",
                CategoryId = categories["低压电器"],
                Brand = "西门子",
                Price = 320.00m,
                Unit = "个",
                Stock = 100,
                MinOrderQty = 5,
                Specs = "{\"额定电流\":\"25A\",\"线圈电压\":\"24VDC\",\"极数\":\"3P\",\"辅助触点\":\"1NO+1NC\"}",
                Description = "SIRIUS 接触器，25A，24VDC线圈，3极+辅助触点",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "西门子 3RV2011-1EA10 断路器",
                ModelNumber = "3RV2011-1EA10",
                CategoryId = categories["低压电器"],
                Brand = "西门子",
                Price = 450.00m,
                Unit = "个",
                Stock = 80,
                MinOrderQty = 5,
                Specs = "{\"额定电流\":\"1.6-2.5A\",\"脱扣特性\":\"Class 10\",\"极数\":\"3P\",\"短路分断\":\"100kA\"}",
                Description = "SIRIUS 电机保护断路器，1.6-2.5A可调",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "施耐德 LC1D25M7 接触器",
                ModelNumber = "LC1D25M7",
                CategoryId = categories["低压电器"],
                Brand = "施耐德",
                Price = 280.00m,
                Unit = "个",
                Stock = 120,
                MinOrderQty = 5,
                Specs = "{\"额定电流\":\"25A\",\"线圈电压\":\"220VAC\",\"极数\":\"3P\",\"辅助触点\":\"1NO+1NC\"}",
                Description = "TeSys D 接触器，25A，220VAC线圈",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "西门子 SIMATIC HMI KTP900 Basic 触摸屏",
                ModelNumber = "6AV2 123-2JB03-0AX0",
                CategoryId = categories["人机界面"],
                Brand = "西门子",
                Price = 6800.00m,
                Unit = "台",
                Stock = 15,
                MinOrderQty = 1,
                Specs = "{\"显示屏尺寸\":\"9英寸\",\"分辨率\":\"800x480\",\"触摸类型\":\"电阻式\",\"通信接口\":\"PROFINET\"}",
                Description = "SIMATIC HMI KTP900 Basic 触摸屏，9英寸，PROFINET接口",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "西门子 SIMATIC HMI TP1200 Comfort 触摸屏",
                ModelNumber = "6AV2 124-0MC01-0AX0",
                CategoryId = categories["人机界面"],
                Brand = "西门子",
                Price = 12500.00m,
                Unit = "台",
                Stock = 10,
                MinOrderQty = 1,
                Specs = "{\"显示屏尺寸\":\"12英寸\",\"分辨率\":\"1280x800\",\"触摸类型\":\"电容式\",\"通信接口\":\"PROFINET x2\"}",
                Description = "SIMATIC HMI TP1200 Comfort 触摸屏，12英寸高清，双网口",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "西门子 SINAMICS V90 伺服驱动器 0.4kW",
                ModelNumber = "6SL3210-5FB10-4UA1",
                CategoryId = categories["伺服系统"],
                Brand = "西门子",
                Price = 3200.00m,
                Unit = "套",
                Stock = 20,
                MinOrderQty = 1,
                Specs = "{\"功率\":\"0.4kW\",\"额定电流\":\"1.6A\",\"输入电压\":\"220V\",\"编码器接口\":\"增量式/绝对值\"}",
                Description = "SINAMICS V90 伺服驱动器，0.4kW，支持脉冲/模拟量/USS/Modbus控制",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "西门子 SIMOTICS S-1FL6 伺服电机 0.4kW",
                ModelNumber = "1FL6034-2AF21-1AA1",
                CategoryId = categories["伺服系统"],
                Brand = "西门子",
                Price = 2800.00m,
                Unit = "台",
                Stock = 25,
                MinOrderQty = 1,
                Specs = "{\"功率\":\"0.4kW\",\"额定转速\":\"3000rpm\",\"额定转矩\":\"1.27Nm\",\"编码器\":\"增量式2500脉冲\"}",
                Description = "SIMOTICS S-1FL6 伺服电机，0.4kW，配V90驱动器使用",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "西门子 SCALANCE XC208 工业交换机",
                ModelNumber = "6GK5208-0BA00-2AC2",
                CategoryId = categories["工业通信"],
                Brand = "西门子",
                Price = 3500.00m,
                Unit = "台",
                Stock = 30,
                MinOrderQty = 1,
                Specs = "{\"端口数\":\"8口\",\"端口类型\":\"RJ45 10/100M\",\"管理类型\":\"非网管\",\"防护等级\":\"IP30\"}",
                Description = "SCALANCE XC208 工业以太网交换机，8口RJ45",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "西门子 SITOP PSU100M 24V/20A 电源",
                ModelNumber = "6EP1334-2BA20",
                CategoryId = categories["电源与配电"],
                Brand = "西门子",
                Price = 2200.00m,
                Unit = "台",
                Stock = 40,
                MinOrderQty = 1,
                Specs = "{\"输出电压\":\"24VDC\",\"输出电流\":\"20A\",\"输入电压\":\"120/230VAC\",\"效率\":\"92%\"}",
                Description = "SITOP PSU100M 开关电源，24V/20A，单相输入",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "西门子 SITOP PSU100M 24V/40A 电源",
                ModelNumber = "6EP1336-2BA00",
                CategoryId = categories["电源与配电"],
                Brand = "西门子",
                Price = 3800.00m,
                Unit = "台",
                Stock = 25,
                MinOrderQty = 1,
                Specs = "{\"输出电压\":\"24VDC\",\"输出电流\":\"40A\",\"输入电压\":\"120/230VAC\",\"效率\":\"93%\"}",
                Description = "SITOP PSU100M 开关电源，24V/40A，单相输入",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            }
        };

        await context.Products.AddRangeAsync(products);
        await context.SaveChangesAsync();
    }

    private static async Task SeedAdminUserAsync(ElectroBuyDbContext context)
    {
        var usersToAdd = new List<User>();

        if (!await context.Users.AnyAsync(u => u.Email == "admin@electrobuy.com"))
        {
            usersToAdd.Add(new User
            {
                Id = Guid.NewGuid(),
                Email = "admin@electrobuy.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123456"),
                Name = "系统管理员",
                Company = "ElectroBuy",
                Phone = "13800138000",
                Role = UserRole.Admin,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            });
        }

        if (!await context.Users.AnyAsync(u => u.Email == "enterprise@electrobuy.com"))
        {
            usersToAdd.Add(new User
            {
                Id = Guid.NewGuid(),
                Email = "enterprise@electrobuy.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Enterprise@123456"),
                Name = "企业用户",
                Company = "测试企业有限公司",
                Phone = "13800138001",
                Role = UserRole.EnterpriseUser,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            });
        }

        if (!await context.Users.AnyAsync(u => u.Email == "user@electrobuy.com"))
        {
            usersToAdd.Add(new User
            {
                Id = Guid.NewGuid(),
                Email = "user@electrobuy.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("User@123456"),
                Name = "普通用户",
                Company = null,
                Phone = "13800138002",
                Role = UserRole.User,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            });
        }

        if (usersToAdd.Any())
        {
            await context.Users.AddRangeAsync(usersToAdd);
            await context.SaveChangesAsync();
        }
    }
}
