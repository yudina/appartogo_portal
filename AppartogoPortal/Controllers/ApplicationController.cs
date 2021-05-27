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
    public class ApplicationController : ControllerBase
    {

        private IUnitOfWork unitOfWork;
        public ApplicationController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<IEnumerable<Application>> Get()
        {
            return await unitOfWork.Application.GetAllAsync();
        }

        [HttpGet("{id}")]
        public async Task<Application> GetById(Guid id)
        {
            return await unitOfWork.Application.GetByIdAsync(id);
        }

        [HttpGet("byaccountid/{id}")]
        public async Task<IReadOnlyList<Application>> GetApplicationByAccountId(Guid id)
        {
            return await unitOfWork.Application.GetApplicationByAccountIdAsync(id);
        }

        [HttpGet("bylistingid/{id}")]
        public async Task<IReadOnlyList<Application>> GetApplicationByListingId(Guid id)
        {
            return await unitOfWork.Application.GetApplicationByListingIdAsync(id);
        }

        [HttpGet("bylistlistingids/{ids}")]
        public async Task<IReadOnlyList<Application>> GetApplicationByListListingId([FromQuery] Guid[] ids)
        {
            return await unitOfWork.Application.GetApplicationByListListingIdAsync(ids);
        }

        [HttpPost]
        public async Task<Guid> Add(Application Application)
        {
            return await unitOfWork.Application.AddAsync(Application);
        }

        [HttpDelete("{id}")]
        public async void Delete(Guid id)
        {
            await unitOfWork.Application.DeleteAsync(id);

        }

        [HttpPut]
        public async void Update(Application Application)
        {
            await unitOfWork.Application.UpdateAsync(Application);
        }

        [HttpGet("bylist/{ids}")]
        public async Task<IReadOnlyList<Application>> GetByListId([FromQuery] Guid[] ids)
        {
            return await unitOfWork.Application.GetByListIdAsync(ids);
        }
    }
}
