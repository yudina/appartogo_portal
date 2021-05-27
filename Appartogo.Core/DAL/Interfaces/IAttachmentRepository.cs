using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Appartogo.Core.DAL.Entities;

namespace Appartogo.Core.DAL.Interfaces
{
    public interface IAttachmentRepository : IGenericRepository<Attachment>
    {
        Task<IReadOnlyList<Attachment>> GetAttachmentByListingIdAsync(Guid listingId);
        Task<IReadOnlyList<Attachment>> GetAttachmentByListListingIdAsync(Guid[] listingIds);

        Task<IReadOnlyList<Attachment>> GetAttachmentByApplicationIdAsync(Guid applicationId);
        Task<IReadOnlyList<Attachment>> GetAttachmentByListApplicationIdAsync(Guid[] applicationIds);

        Task<IReadOnlyList<Attachment>> GetAttachmentByMessageIdAsync(Guid messageId);
    }
}
