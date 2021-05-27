using System;
using System.Collections.Generic;
using System.Text;

namespace Appartogo.Core.DAL.Entities
{
    public class Organization
    {
        public Guid Id              { get; set; }
        public Guid AddressId       { get; set; }
        public string Name          { get; set; }
    }
}
