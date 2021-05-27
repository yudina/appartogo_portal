using System;
using System.Collections.Generic;
using System.Text;

namespace Appartogo.Core.DAL.Entities
{
    public class Property
    {

        public Guid Id                  { get; set; }
        public Guid AddressId           { get; set; }
        public Guid OrganizationId      { get; set; }
        public int ApartmentCount       { get; set; }
        public bool CanSmoke            { get; set; }
        public bool AnimalsFriendly     { get; set; }
        public bool Archived            { get; set; }
    }
}
