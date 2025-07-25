using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Collections.Generic;
using TestWithKendo.DAL;
using TestWithKendo.Entities;

namespace TestWithKendo.Pages
{
    public class TaskGroupListModel(ApplicationDbContext _context, IConfiguration _config) : PageModel
    {
        public string BankId { get; set; }
        public string BankName { get; set; }
        public string Tab { get; set; }
        public List<TaskGroupType> TaskGroupTypeRecords { get; set; } = new();

        public IActionResult OnGet(string bankId, string tab)
        {
            if (string.IsNullOrEmpty(bankId))
            {
                HttpContext.Session.SetString("redirectURL", "/TaskGroupList");
                return RedirectToPage("/BankSelect");
            }

            BankId = bankId;
            Tab = string.IsNullOrEmpty(tab) ? "C" : tab;
            
            TaskGroupTypeRecords = _context.TaskGroupTypes
                .Where(x => x.TaskProcessing.Equals(Tab, StringComparison.OrdinalIgnoreCase)) 
                .ToList();

            return Page();
        }
    }
}
