using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Appartogo.Core.DAL.Entities;

namespace Appartogo.Core.DAL.Interfaces
{
    public interface IPropertyRepository : IGenericRepository<Property>
    {
        Task<IReadOnlyList<Property>> GetPropertyByOrganizationIdAsync(Guid organizationId);
        Task<IReadOnlyList<Property>> GetPropertyByOrganizationIdUnarchivedAsync(Guid organizationId);
        Task<IReadOnlyList<Property>> GetPropertyByListOrganizationIdAsync(Guid[] organizationIds);
        Task<IReadOnlyList<Property>> GetAllUnarchivedAsync();
    }
}
