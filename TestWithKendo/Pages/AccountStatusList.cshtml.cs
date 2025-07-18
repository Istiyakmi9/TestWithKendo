using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using TestWithKendo.DAL;
using TestWithKendo.Entities;
using TestWithKendo.Services;

namespace TestWithKendo.Pages
{
    public class AccountStatusListModel : PageModel
    {
        private readonly ApplicationDbContext _context;
        private readonly AccountStatusListService _accountStatusListService;

        public AccountStatusListModel(ApplicationDbContext context, AccountStatusListService accountStatusListService)
        {
            _context = context;
            _accountStatusListService = accountStatusListService;
        }

        public IList<AccountClass> AccountClass { get;set; } = default!;
        public string LoanAccountStatusList = string.Empty;

        public async Task OnGetAsync()
        {
            var loanAccountStatusList = await _accountStatusListService.LoadAccountStatus();
            LoanAccountStatusList = JsonConvert.SerializeObject(loanAccountStatusList);

            AccountClass = await _context.AccountClasses
                .Include(a => a.LoanStatuses)
                .OrderBy(x => x.AccountClassSortOrder)
                .ToListAsync();
        }
    }
}
