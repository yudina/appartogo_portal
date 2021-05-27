using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Appartogo.Core.DAL.Entities;

namespace Appartogo.Core.DAL.Interfaces
{
    public interface IOrganizationAccountRepository : IGenericRepository<OrganizationAccount>
    {

        Task<IReadOnlyList<OrganizationAccount>> GetOrganizationAccountByAccountIdAsync(Guid accountId);
        Task<IReadOnlyList<OrganizationAccount>> GetOrganizationAccountByOrganizationIdAsync(Guid organizationId);

    }
}
