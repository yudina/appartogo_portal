using Infrastructure.DataStores;
using Infrastructure.FileSystem;
using Infrastructure.Localize;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Resources
{
    public class ResourceRepository : IResourceRepository
    {
        private readonly IFileSystem fileSystem;
        private readonly JsonDataStoreDictionary<string, Localized<string>> dataStore;

        public ResourceRepository(IFileSystemFactory fileSystemFactory, ILogger<ResourceRepository> logger)
        {
            fileSystem = fileSystemFactory.Get("Data");
            dataStore = new JsonDataStoreDictionary<string, Localized<string>>(logger);
        }

        public async Task<IDictionary<string, Localized<string>>> GetAllAsync()
        {
            return await dataStore.GetAllAsync(fileSystem, "resources.json");
        }
    }
}