using Microsoft.EntityFrameworkCore;
using TestWithKendo.DAL;

namespace TestWithKendo.Services
{
    public class AccountStatusListService
    {
        private readonly ApplicationDbContext _context;

        public AccountStatusListService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<dynamic>> LoadAccountStatus(int accountClassId)
        {
            var result = (from ac in _context.AccountClasses
                          join ls in _context.LoanStatuses
                              on ac.AccountClassId equals ls.AccountClassId into gj
                          from ls in gj.DefaultIfEmpty()
                          where ac.AccountClassId == accountClassId && 
                          (ls.IsApplicationStatus == false || ls.IsApplicationStatus == null)
                          orderby ac.AccountClassSortOrder, ls.StatusDescription
                          select new
                          {
                              ac.AccountClassId,
                              ac.AccountClassName,
                              ac.AccountClassCode,
                              ls.StatusId,
                              ls.StatusDescription,
                              ls.StatusCode,
                              ls.IsDefault,
                              ls.IsActive,
                              ls.IsApplicationStatus,
                              ls.IsActiveApplicationStatus,
                              ls.IsApprovedApplicationStatus,
                              ls.IsDefaultApplicationStatus,
                              AccountCount = _context.Loanses.Count(l => l.LoanStatusId == ls.StatusId)
                          }).ToList<dynamic>();

            return await Task.FromResult(result);
        }
    }
}
