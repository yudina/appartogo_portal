using Appartogo.Core.DAL.Entities;
using Appartogo.Core.DAL.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppartogoPortal.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ConversationController : ControllerBase
    {

        private IUnitOfWork unitOfWork;
        public ConversationController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<IEnumerable<Conversation>> Get()
        {
            return await unitOfWork.Conversation.GetAllAsync();
        }

        [HttpGet("unarchived")]
        public async Task<IReadOnlyList<Conversation>> GetAllUnarchived()
        {
            return await unitOfWork.Conversation.GetAllUnarchivedAsync();
        }

        [HttpGet("{id}")]
        public async Task<Conversation> GetById(Guid id)
        {
            return await unitOfWork.Conversation.GetByIdAsync(id);
        }

        [HttpPost]
        public async Task<Guid> Add(Conversation Conversation)
        {
            return await unitOfWork.Conversation.AddAsync(Conversation);
        }

        [HttpDelete("{id}")]
        public async void Delete(Guid id)
        {
            await unitOfWork.Conversation.DeleteAsync(id);

        }

        [HttpPut]
        public async void Update(Conversation Conversation)
        {
            await unitOfWork.Conversation.UpdateAsync(Conversation);
        }

        [HttpGet("bylist/{ids}")]
        public async Task<IReadOnlyList<Conversation>> GetByListId([FromQuery] Guid[] ids)
        {
            return await unitOfWork.Conversation.GetByListIdAsync(ids);
        }

        [HttpGet("bycreatedbyid/{id}")]
        public async Task<IReadOnlyList<Conversation>> GetConversationByCreatedById(Guid id)
        {
            return await unitOfWork.Conversation.GetConversationByCreatedByIdAsync(id); 
        }

        [HttpGet("byotherparticipantid/{id}")]
        public async Task<IReadOnlyList<Conversation>> GetConversationByOtherParticipantId(Guid id)
        {
            return await unitOfWork.Conversation.GetConversationByOtherParticipantIdAsync(id);
        }

        [HttpGet("bylistingid/{id}")]
        public async Task<IReadOnlyList<Conversation>> GetConversationByListingId(Guid id)
        {
            return await unitOfWork.Conversation.GetConversationByListingIdAsync(id);
        }

        [HttpGet("bylistlistingids/{ids}")]
        public async Task<IReadOnlyList<Conversation>> GetConversationByListListingId([FromQuery] Guid[] ids)
        {
            return await unitOfWork.Conversation.GetConversationByListListingIdAsync(ids);
        }
    }
}
