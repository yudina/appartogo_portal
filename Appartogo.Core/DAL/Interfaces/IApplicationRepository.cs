using System;
using System.Collections.Generic;
using System.Text;
using Appartogo.Core.DAL.Entities;
using System.Threading.Tasks;

namespace Appartogo.Core.DAL.Interfaces
{
    public interface IApplicationRepository : IGenericRepository<Application>
    {

        Task<IReadOnlyList<Application>> GetApplicationByAccountIdAsync(Guid accountId);
        Task<IReadOnlyList<Application>> GetApplicationByListingIdAsync(Guid listingId);
        Task<IReadOnlyList<Application>> GetApplicationByListListingIdAsync(Guid[] listingIds);

    }
}
