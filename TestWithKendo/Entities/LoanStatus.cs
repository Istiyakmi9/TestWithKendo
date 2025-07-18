using System.ComponentModel.DataAnnotations;

namespace TestWithKendo.Entities
{
    public class LoanStatus
    {
        [Key]
        public int StatusId { get; set; }
        public string StatusDescription { get; set; }
        public string StatusCode { get; set; }
        public bool IsDefault { get; set; }
        public bool IsActive { get; set; }
        public bool IsApplicationStatus { get; set; }
        public bool IsActiveApplicationStatus { get; set; }
        public bool IsApprovedApplicationStatus { get; set; }
        public bool IsDefaultApplicationStatus { get; set; }
        public int AccountClassId { get; set; }
        public int AccountCount { get; set; }
    }
}
