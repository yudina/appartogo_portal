using System;
using System.Collections.Generic;
using System.Text;

namespace Appartogo.Core.DAL.Entities
{
    public class OrganizationAccount
    {
        public Guid Id                { get; set; }
        public Guid AccountId         { get; set; }
        public Guid OrganizationId    { get; set; }
    }
}
