using System;
using System.Collections.Generic;
using System.Text;

namespace Appartogo.Core.DAL.Entities
{
    public class Address
    {
        public Guid Id                  { get; set; }
        public string CivicNumber       { get; set; }
        public string StreetName        { get; set; }
        public string City	            { get; set; }
        public string PostalCode        { get; set; }
        public string Country	        { get; set; }
        public string State             { get; set; }
        public string ApartmentNumber   { get; set; }
    }
}
