using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Appartogo.Core.DAL.Entities;

namespace Appartogo.Core.DAL.Interfaces
{
    public interface IApartmentRepository : IGenericRepository<Apartment>
    {
        Task<IReadOnlyList<Apartment>> GetApartmentByPropertyIdAsync(Guid propertyId);
        Task<IReadOnlyList<Apartment>> GetApartmentByTenantIdAsync(Guid tenantId);
        Task<IReadOnlyList<Apartment>> GetApartmentByListPropertyIdAsync(Guid[] propertyIds);
        Task<IReadOnlyList<Apartment>> GetApartmentByListPropertyIdUnarchivedAsync(Guid[] propertyIds);
        Task<IReadOnlyList<Apartment>> GetAllUnarchivedAsync();
    }
}
