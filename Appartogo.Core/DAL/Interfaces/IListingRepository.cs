using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Appartogo.Core.DAL.Entities;

namespace Appartogo.Core.DAL.Interfaces
{
    public interface IListingRepository : IGenericRepository<Listing>
    {
        Task<IReadOnlyList<Listing>> GetListingByApartmentIdAsync(Guid apartmentId);
        Task<IReadOnlyList<Listing>> GetListingByListApartmentIdAsync(Guid[] apartmentIds);
        Task<IReadOnlyList<Listing>> GetAllUnarchivedAsync();
    }
}
