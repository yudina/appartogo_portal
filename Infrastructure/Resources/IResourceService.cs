using System.Threading.Tasks;

namespace Infrastructure.Resources
{
    public interface IResourceService
    {
        Task<ResourceCollection> GetResourcesAsync();
    }
}
