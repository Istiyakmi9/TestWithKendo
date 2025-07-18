using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using TestWithKendo.Entities;

namespace TestWithKendo.Pages
{
    public class AccountStatusListModel : PageModel
    {
        private readonly TestWithKendo.DAL.ApplicationDbContext _context;

        public AccountStatusListModel(TestWithKendo.DAL.ApplicationDbContext context)
        {
            _context = context;
        }

        public IList<AccountClass> AccountClass { get;set; } = default!;

        public async Task OnGetAsync()
        {
            AccountClass = await _context.AccountClasses
                .Include(a => a.LoanStatuses)
                .OrderBy(x => x.SortOrder)
                .ToListAsync();
        }
    }
}
