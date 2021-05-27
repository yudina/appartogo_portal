using System;
using System.Collections.Generic;
using System.Text;

namespace Appartogo.Core.DAL.Entities
{
    public class Tenant
    {
        public Guid Id                              { get; set; }
        public Guid AccountId                       { get; set; }
        public int CreditScore                      { get; set; }
        public string RentalInsuranceNumber         { get; set; }
        public bool ActiveLease                     { get; set; }
    }
}
