using System;
using System.Collections.Generic;

namespace AppartogoApiClient
{
    public class ListingBase : IListingBase
    {
        public int Id { get; set; }
        public string OrganizationId { get; set; }
        public DateTime LastModified { get; set; }

        public List<Listing.Source> Sources { get; set; } = new List<Listing.Source>();

        public decimal? Price { get; set; }

        public override string ToString()
        {
            return $"{Id}";
        }
    }
}