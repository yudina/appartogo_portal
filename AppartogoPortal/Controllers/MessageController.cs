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
    public class MessageController : ControllerBase
    {

        private IUnitOfWork unitOfWork;
        public MessageController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<IEnumerable<Message>> Get()
        {
            return await unitOfWork.Message.GetAllAsync();
        }

        [HttpGet("unarchived")]
        public async Task<IReadOnlyList<Message>> GetAllUnarchived()
        {
            return await unitOfWork.Message.GetAllUnarchivedAsync();
        }

        [HttpGet("{id}")]
        public async Task<Message> GetById(Guid id)
        {
            return await unitOfWork.Message.GetByIdAsync(id);
        }

        [HttpPost]
        public async Task<Guid> Add(Message Message)
        {
            return await unitOfWork.Message.AddAsync(Message);
        }

        [HttpDelete("{id}")]
        public async void Delete(Guid id)
        {
            await unitOfWork.Message.DeleteAsync(id);

        }

        [HttpPut]
        public async void Update(Message Message)
        {
            await unitOfWork.Message.UpdateAsync(Message);
        }

        [HttpGet("bylist/{ids}")]
        public async Task<IReadOnlyList<Message>> GetByListId([FromQuery] Guid[] ids)
        {
            return await unitOfWork.Message.GetByListIdAsync(ids);
        }

        [HttpGet("byconversationid/{id}")]
        public async Task<IReadOnlyList<Message>> GetMessageByConversationIdAsync(Guid id)
        {
            return await unitOfWork.Message.GetMessageByConversationIdAsync(id);
        }

        [HttpGet("firstmessage/byconversationid/{id}")]
        public async Task<Message> GetFirstMessageByConversationId(Guid id)
        {
            return await unitOfWork.Message.GetFirstMessageByConversationIdAsync(id);
        }

        [HttpGet("applicationmessages/byconversationid/{id}")]
        public async Task<IReadOnlyList<Message>> GetApplicationMessageByConversationId(Guid id)
        {
            return await unitOfWork.Message.GetApplicationMessageByConversationIdAsync(id);
        }
    }
}
