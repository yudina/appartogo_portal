using Infrastructure.Localize;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Resources
{
    public interface IResourceRepository
    {
        Task<IDictionary<string, Localized<string>>> GetAllAsync();
    }
}
