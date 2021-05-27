using Infrastructure.Caches;
using Infrastructure.Localize;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Resources
{
    public class ResourceRepositoryCached : IResourceRepository
    {
        private const string CacheType = "Resources";

        private readonly IResourceRepository resourceRepository;

        private readonly CacheDictExpirable<IDictionary<string, Localized<string>>> cache;

        public ResourceRepositoryCached(IResourceRepository resourceRepository, IOptions<CacheOptions> options, ILogger<ResourceRepositoryCached> logger)
        {
            if (resourceRepository == null)
                throw new ArgumentNullException(nameof(resourceRepository));
            if (options == null)
                throw new ArgumentNullException(nameof(options));
            if (logger == null)
                throw new ArgumentNullException(nameof(logger));

            this.resourceRepository = resourceRepository;

            cache = new CacheDictExpirable<IDictionary<string, Localized<string>>>(CacheType, options.Value.Expirations[CacheType]);
        }

        public async Task<IDictionary<string, Localized<string>>> GetAllAsync()
        {
            var value = cache.Get("default");
            if (value == null)
            {
                value = await resourceRepository.GetAllAsync();
                cache.Add("default", value);
            }
            return value;
        }
    }
}