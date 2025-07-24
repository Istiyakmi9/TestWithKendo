using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace TestWithKendo.Pages
{
    public class TaskGroupListModel : PageModel
    {
        private readonly IConfiguration _config;
        public string BankId { get; set; }
        public string BankName { get; set; }
        public string Tab { get; set; }
        public List<TaskGroupInfo> CreditGroups { get; set; } = new();
        public List<TaskGroupInfo> AccountGroups { get; set; } = new();

        public class TaskGroupInfo
        {
            public int TaskGroupId { get; set; }
            public string TaskGroupLabel { get; set; }
            public int TaskCount { get; set; }
            public int ExceptionCount { get; set; }
            public string TaskProcessing { get; set; }
        }

        public TaskGroupListModel(IConfiguration config)
        {
            _config = config;
        }

        public IActionResult OnGet(string bankId, string tab)
        {
            if (string.IsNullOrEmpty(bankId))
            {
                HttpContext.Session.SetString("redirectURL", "/TaskGroupList");
                return RedirectToPage("/BankSelect");
            }

            BankId = bankId;
            Tab = string.IsNullOrEmpty(tab) ? "C" : tab;

            // Replace this with your actual bank lookup method
            BankName = GetBankName(bankId);

            LoadTaskGroups(bankId, "C", CreditGroups);
            LoadTaskGroups(bankId, "L", AccountGroups);

            return Page();
        }

        private void LoadTaskGroups(string bankId, string type, List<TaskGroupInfo> list)
        {
            // Example mock data for development/testing
            list.Add(new TaskGroupInfo
            {
                TaskGroupId = 1,
                TaskGroupLabel = "Credit Task",
                TaskProcessing = "L",
                TaskCount = 5,
                ExceptionCount = 2
            });
        }


        private string GetBankName(string bankId)
        {
            // Example: lookup from DB or memory
            return "Demo Bank";
        }
    }
}
