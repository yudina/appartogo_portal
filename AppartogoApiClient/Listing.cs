using Infrastructure.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AppartogoApiClient
{
    public class Listing : ListingBase
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public List<string> ImageUrls { get; set; } = new List<string>();
        public DateTimeOffset PostedDateTime { get; set; } = DateTimeOffset.MinValue;

        public double? Lat { get; set; }
        public double? Long { get; set; }
        public bool HasCoordinate { get { return Lat.HasValue && Long.HasValue && Lat.Value != 0 && Long.Value != 0; } }

        public string Location { get; set; } = string.Empty;
        public string Adress { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string PostalCode { get; set; } = string.Empty;
        public string Neighbourhood { get; set; }
        public string State { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string Region { get; set; }

        public bool AddressValid
        {
            get
            {
                return (!string.IsNullOrEmpty(Adress) && !string.IsNullOrEmpty(City)) || !string.IsNullOrEmpty(PostalCode);
            }
        }

        public string BuildAdress()
        {
            var sb = new StringBuilder();
            if (!string.IsNullOrEmpty(Adress) && !string.IsNullOrEmpty(City))
                sb.Append(Adress + ", " + City);

            if (!string.IsNullOrEmpty(PostalCode))
            {
                if (sb.Length > 0)
                    sb.Append(", ");
                sb.Append(PostalCode);
            }

            return sb.ToString();
        }

        public string TypeLogement { get; set; }
        public string Pieces { get; set; }
        public string SallesBain { get; set; }
        public bool Electricite { get; set; }
        public bool Chauffage { get; set; }
        public bool Eau { get; set; }
        public bool Stationnement { get; set; }
        public bool Animaux { get; set; }
        public bool Meuble { get; set; }
        public bool AirConditionne { get; set; }
        public bool Fumeurs { get; set; }
        public bool Cable { get; set; }
        public bool Internet { get; set; }

        public int? PiedCarres { get; set; }
        public DateTimeOffset? DateEmmenagement { get; set; }

        public Dictionary<string, object> Properties { get; set; } = new Dictionary<string, object>();

        public bool HasSource(string sourceType, string sourceKey)
        {
            return Sources.FirstOrDefault(s => StringUtils.NormalizeComponentForUri(s.SourceType) == sourceType && StringUtils.NormalizeComponentForUri(s.SourceKey) == sourceKey) != null;
        }

        public bool HasSource(string sourceType)
        {
            return Sources.FirstOrDefault(s => StringUtils.NormalizeComponentForUri(s.SourceType) == sourceType) != null;
        }

        public void CopySecondariesSourcesTo(Listing listing)
        {
            for (int i = 1; i < Sources.Count; ++i)
                listing.Sources.Add(Sources[i]);
        }

        public override string ToString()
        {
            return $"{Country}/{State}/{Region}/{Neighbourhood}/{City} [{Lat},{Long}] --> {Location}";
        }

        public class Source
        {
            public string SourceType { get; set; }
            public string SourceKey { get; set; }
            public string SourceUrl { get; set; }
            public string Group { get; set; }

            public override string ToString()
            {
                return $"{SourceType}-{SourceKey} [Group={Group}]";
            }
        }
    }
}