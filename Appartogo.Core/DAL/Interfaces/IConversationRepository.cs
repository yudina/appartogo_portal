using System;
using System.Collections.Generic;
using System.Text;
using Appartogo.Core.DAL.Entities;
using System.Threading.Tasks;

namespace Appartogo.Core.DAL.Interfaces
{
    public interface IConversationRepository : IGenericRepository<Conversation>
    {
        Task<IReadOnlyList<Conversation>> GetConversationByCreatedByIdAsync(Guid createdById);
        Task<IReadOnlyList<Conversation>> GetConversationByOtherParticipantIdAsync(Guid otherParticipantId);
        Task<IReadOnlyList<Conversation>> GetConversationByListingIdAsync(Guid listingId);
        Task<IReadOnlyList<Conversation>> GetConversationByListListingIdAsync(Guid[] listingIds);
        Task<IReadOnlyList<Conversation>> GetAllUnarchivedAsync();
    }
}
