using System;
using System.Collections.Generic;
using System.Text;

namespace Appartogo.Core.DAL.Entities
{
    public class Application
    {
        public Guid Id		                { get; set; }
        public Guid AccountId               { get; set; }
        public Guid ListingId               { get; set; }
        public bool ConsentForCreditCheck   { get; set; }
        public bool WantsRentalInsurance    { get; set; }
        public int Status                   { get; set; }
        public DateTime ApplicationDate     { get; set; }
    }
}
