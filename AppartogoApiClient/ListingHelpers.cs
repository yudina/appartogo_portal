using System.Collections.Generic;

namespace AppartogoApiClient
{
    public static class ListingHelpers
    {
        public static Dictionary<string, IListingBase> BuildSourceTypeAndKeyDict(IEnumerable<IListingBase> listings)
        {
            var dict = new Dictionary<string, IListingBase>();
            foreach (var l in listings)
            {
                foreach (var source in l.Sources)
                    dict.TryAdd(GetDictSourceKey(source), l);
            }

            return dict;
        }

        public static string GetDictSourceKey(Listing.Source source)
        {
            return $"{source.SourceType}_{source.SourceKey}";
        }
    }
}