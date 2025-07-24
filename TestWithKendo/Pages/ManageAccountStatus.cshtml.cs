using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using TestWithKendo.DAL;
using TestWithKendo.Entities;

namespace TestWithKendo.Pages
{
    public class ManageAccountStatusModel : PageModel
    {
        public string PageTitle = "Account status main";

        [BindProperty]
        public LoanStatus loanStatus { set; get; }

        private readonly ApplicationDbContext _context;
        public string AccountClassId = string.Empty;

        public ManageAccountStatusModel(ApplicationDbContext context)
        {
            _context = context;
        }

        public void OnGet()
        {
            AccountClassId = Request.Query["accountClassId"];
            loanStatus = _context.LoanStatuses.FirstOrDefault(x => x.AccountClassId == int.Parse(AccountClassId));
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
