using System;
using System.Collections.Generic;

namespace Infrastructure.Caches
{
    public class CacheDictExpirable<T> where T : class
    {
        private readonly TimeSpan expiration;

        private readonly object syncObject = new object();
        private Dictionary<string, CacheItem<T>> cache = new Dictionary<string, CacheItem<T>>();

        public CacheDictExpirable(string name, TimeSpan expiration)
        {
            this.expiration = expiration;
        }

        public T Get(string key)
        {
            if (!cache.TryGetValue(key, out var cacheItem))
                return null;

            if (DateTime.UtcNow <= cacheItem.ExpirationDate)
                return cacheItem.Item;

            //Expired - remove it
            lock (syncObject)
            {
                cache.Remove(key);
            }

            return null;
        }

        public void Add(string key, T item)
        {
            lock (syncObject)
            {
                if (cache.TryGetValue(key, out var cacheItem))
                    return;

                cacheItem = new CacheItem<T>(expiration)
                {
                    Item = item
                };
                cache.Add(key, cacheItem);
            }
        }

        public void Invalidate(string key)
        {
            cache.Remove(key);
        }
    }
}