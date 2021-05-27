using System;
using System.Collections.Generic;
using System.Text;

namespace Appartogo.Core.DAL.Entities
{
    public class Listing
    {
        public Guid Id                      { get; set; }
        public Guid ApartmentId             { get; set; }
        public string Titre                 { get; set; }
        public string Description           { get; set; }
        public int Rent                     { get; set; }
        public bool Archived                { get; set; }
        public DateTime PostedDateTime      { get; set; }
    }
}
