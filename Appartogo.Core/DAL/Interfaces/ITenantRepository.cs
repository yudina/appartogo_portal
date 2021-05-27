using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Appartogo.Core.DAL.Entities;

namespace Appartogo.Core.DAL.Interfaces
{
    public interface ITenantRepository : IGenericRepository<Tenant>
    {

        Task<IReadOnlyList<Tenant>> GetTenantByAccountIdAsync(Guid accountId);
        Task<IReadOnlyList<Tenant>> GetTenantByListAccountIdAsync(Guid[] accountIds);
    }
}
