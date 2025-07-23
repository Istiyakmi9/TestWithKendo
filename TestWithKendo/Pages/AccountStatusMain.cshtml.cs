using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using TestWithKendo.DAL;
using TestWithKendo.Entities;

namespace TestWithKendo.Pages
{
    public class AccountStatusMainModel : PageModel
    {
        public string PageTitle = "Account status main";
        
        [BindProperty]
        public LoanStatus loanStatus { set; get; }

        private readonly ApplicationDbContext _context;

        public AccountStatusMainModel(ApplicationDbContext context)
        {
            _context = context;
        }

        public void OnGet()
        {
            loanStatus = new LoanStatus
            {
                StatusId = 2,
                StatusDescription = "",
                StatusCode = "",
                IsDefault = true,
                IsActive = true,
                AccountClassId = 1,
                IsApplicationStatus = false,
                AccountCount = 0
            };
        }

        public IActionResult OnPostSave()
        {
            if (loanStatus == null)
            {
                return Page();
            }

            var lastRecord = _context.LoanStatuses.OrderByDescending(x => x.StatusId).First();
            loanStatus.StatusId = lastRecord.StatusId + 1;

            _context.LoanStatuses.Add(loanStatus);
            _context.SaveChanges();

            return RedirectToPage("/accountstatuslist", new { accountClassId = 1 });
        }
    }
}
