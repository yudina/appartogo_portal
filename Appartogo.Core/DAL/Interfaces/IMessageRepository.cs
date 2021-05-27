using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Appartogo.Core.DAL.Entities;

namespace Appartogo.Core.DAL.Interfaces
{
    public interface IMessageRepository : IGenericRepository<Message>
    {
        Task<IReadOnlyList<Message>> GetMessageByConversationIdAsync(Guid conversationId);
        Task<Message> GetFirstMessageByConversationIdAsync(Guid conversationId);
        Task<IReadOnlyList<Message>> GetApplicationMessageByConversationIdAsync(Guid conversationId);
        Task<IReadOnlyList<Message>> GetAllUnarchivedAsync();
    }
}
