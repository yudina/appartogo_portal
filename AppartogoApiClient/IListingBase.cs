using System;
using System.Collections.Generic;

namespace AppartogoApiClient
{
    public interface IListingBase
    {
        public int Id { get; set; }

        public DateTime LastModified { get; set; }

        public List<Listing.Source> Sources { get; set; }

        public decimal? Price { get; set; }
    }
}