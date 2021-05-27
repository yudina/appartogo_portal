using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace Infrastructure.Resources
{
    public class ResourceService : IResourceService
    {
        private readonly IResourceRepository resourceRepository;
        private readonly ILogger logger;

        public ResourceService(IResourceRepository resourceRepository, ILogger<ResourceService> logger)
        {
            if (resourceRepository == null)
                throw new ArgumentNullException(nameof(resourceRepository));
            if (logger == null)
                throw new ArgumentNullException(nameof(logger));

            this.resourceRepository = resourceRepository;
            this.logger = logger;
        }

        public async Task<ResourceCollection> GetResourcesAsync()
        {
            try
            {
                var resources = await resourceRepository.GetAllAsync();

                return new ResourceCollection(resources);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Unexpected error at {nameof(GetResourcesAsync)}");
                return null;
            }
        }
    }
}
