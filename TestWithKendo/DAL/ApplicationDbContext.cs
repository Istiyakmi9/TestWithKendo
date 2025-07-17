using Microsoft.EntityFrameworkCore;
using TestWithKendo.Entities;

namespace TestWithKendo.DAL
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<AccountClass> AccountClasses { get; set; }
        public DbSet<LoanStatus> LoanStatuses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AccountClass>(entity =>
            {
                entity.HasKey(e => e.AccountClassId);
                entity.HasData(
                    new AccountClass { AccountClassId = 1, AccountClassName = "Loan", AccountClassCode = "loan", SortOrder = 1 }
                );
            });

            modelBuilder.Entity<LoanStatus>(entity =>
            {
                entity.HasKey(e => e.StatusId);
                entity.HasData(
                    new LoanStatus { StatusId = 1, StatusDescription = "Pending", StatusCode = "PEN", IsDefault = true, IsActive = true, AccountClassId = 1, IsApplicationStatus = false, AccountCount = 0 }
                );
            });

            modelBuilder.Entity<Employee>(entity =>
            {
                entity.HasKey(e => e.EmployeeUid);
                entity.HasData(
                    new Employee { EmployeeUid = 1, FirstName = "Amit", LastName = "Kumar", Email = "amit@gmail.com", Mobile = "8885485421" },
                    new Employee { EmployeeUid = 2, FirstName = "Sumit", LastName = "Kumar", Email = "sumit@gmail.com", Mobile = "8885485422" },
                    new Employee { EmployeeUid = 3, FirstName = "Raounak", LastName = "Saikh", Email = "rounak@gmail.com", Mobile = "8885485234" },
                    new Employee { EmployeeUid = 4, FirstName = "Khusbu", LastName = "Kumari", Email = "khusbu@gmail.com", Mobile = "8885499876" },
                    new Employee { EmployeeUid = 5, FirstName = "Anil", LastName = "Singh", Email = "anil@gmail.com", Mobile = "8978685421" },
                    new Employee { EmployeeUid = 6, FirstName = "Ali", LastName = "Md", Email = "ali@gmail.com", Mobile = "6756085421" },
                    new Employee { EmployeeUid = 7, FirstName = "Mukesh", LastName = "Anup", Email = "mukesh@gmail.com", Mobile = "5248135682" },
                    new Employee { EmployeeUid = 8, FirstName = "Rohit", LastName = "Singh", Email = "rohit@gmail.com", Mobile = "9958642035" },
                    new Employee { EmployeeUid = 9, FirstName = "Ravi", LastName = "Kumar", Email = "ravi@gmail.com", Mobile = "8824579201" }
                );
            });
        }
    }
}
