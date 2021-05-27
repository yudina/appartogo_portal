using Infrastructure.Localize;
using System;

namespace Infrastructure.Caches
{
    public class CacheOptions
    {
        public CacheOptions()
        {
            Expirations = new WildcardDictionary<TimeSpan>();
        }

        public WildcardDictionary<TimeSpan> Expirations { get; set; }
    }
}
