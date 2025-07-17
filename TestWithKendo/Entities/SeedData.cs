using TestWithKendo.DAL;

namespace TestWithKendo.Entities
{
    public class SeedData
    {
        public static void PreConfiguraData(ApplicationDbContext context)
        {
            if (!context.AccountClasses.Any())
            {
                context.AccountClasses.AddRange(
                    new AccountClass { AccountClassId = 1, AccountClassName = "Loan", AccountClassCode = "loan", SortOrder = 1 }
                );

                context.SaveChanges();
            }

            if (!context.LoanStatuses.Any())
            {
                context.LoanStatuses.AddRange(
                    new LoanStatus { StatusId = 1, StatusDescription = "Pending", StatusCode = "PEN", IsDefault = true, IsActive = true, AccountClassId = 1, IsApplicationStatus = false, AccountCount = 0 }
                );

                context.SaveChanges();
            }

            if (!context.Employees.Any())
            {
                context.Employees.AddRange(
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

                context.SaveChanges();
            }
        }
    }
}
