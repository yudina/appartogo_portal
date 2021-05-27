using System;
using System.Collections.Generic;
using System.Text;

namespace Appartogo.Core.DAL.Entities
{
    public class Apartment
    {
        public Guid Id                  { get; set; }
        public string ApartmentNumber   { get; set; }
        public Guid TenantId            { get; set; }
        public Guid PropertyId          { get; set; }
        public string ApartmentType     { get; set; }
        public int Rooms                { get; set; }
        public int Bathrooms            { get; set; }
        public string Size              { get; set; }
        public bool HasWater		    { get; set; }
        public bool HasHeater           { get; set; }
        public bool HasParking          { get; set; }
        public bool HasFurniture        { get; set; }
        public bool HasAirconditioner   { get; set; }
        public bool HasCable            { get; set; }
        public bool HasInternet         { get; set; }
        public DateTime? AvailibityDate { get; set; }
        public bool Archived            { get; set; }
    }
}
