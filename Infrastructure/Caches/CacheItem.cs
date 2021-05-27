using System;

namespace Infrastructure.Caches
{
    public class CacheItem<TItem>
    {
        public CacheItem(TimeSpan expiration)
        {
            ExpirationDate = DateTime.UtcNow.Add(expiration);
        }

        public TItem Item { get; set; }
        public DateTime ExpirationDate { get; private set; }
    }
}
