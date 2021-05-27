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
    public class OrganizationAccountController : ControllerBase
    {
        private IUnitOfWork unitOfWork;
        public OrganizationAccountController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<IEnumerable<OrganizationAccount>> Get()
        {
            return await unitOfWork.OrganizationAccount.GetAllAsync();
        }

        [HttpGet("{id}")]
        public async Task<OrganizationAccount> GetById(Guid id)
        {
            return await unitOfWork.OrganizationAccount.GetByIdAsync(id);
        }

        [HttpGet("byaccountid/{id}")]
        public async Task<IReadOnlyList<OrganizationAccount>> GetOrganizationAccountByAccountId(Guid id)
        {
            return await unitOfWork.OrganizationAccount.GetOrganizationAccountByAccountIdAsync(id);
        }

        [HttpGet("byorganizationid/{id}")]
        public async Task<IReadOnlyList<OrganizationAccount>> GetOrganizationAccountByOrganizationId(Guid id)
        {
            return await unitOfWork.OrganizationAccount.GetOrganizationAccountByOrganizationIdAsync(id);
        }

        [HttpPost]
        public async Task<Guid> Add(OrganizationAccount OrganizationAccount)
        {
            return await unitOfWork.OrganizationAccount.AddAsync(OrganizationAccount);
        }

        [HttpDelete("{id}")]
        public async void Delete(Guid id)
        {
            await unitOfWork.OrganizationAccount.DeleteAsync(id);

        }

        [HttpPut]
        public async void Update(OrganizationAccount OrganizationAccount)
        {
            await unitOfWork.OrganizationAccount.UpdateAsync(OrganizationAccount);
        }

        [HttpGet("bylist/{ids}")]
        public async Task<IReadOnlyList<OrganizationAccount>> GetByListId([FromQuery] Guid[] ids)
        {
            return await unitOfWork.OrganizationAccount.GetByListIdAsync(ids);
        }
    }
}
