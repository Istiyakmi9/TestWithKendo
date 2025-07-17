using System.ComponentModel.DataAnnotations;

namespace TestWithKendo.Entities
{
    public class AccountClass
    {
        [Key]
        public int AccountClassId { get; set; }
        public string AccountClassName { get; set; }
        public string AccountClassCode { get; set; }
        public int SortOrder { get; set; }
        public List<LoanStatus> LoanStatuses { get; set; } = new();
    }
}
