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
    public class TenantController : ControllerBase
    {

        private IUnitOfWork unitOfWork;
        public TenantController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<IEnumerable<Tenant>> Get()
        {
            return await unitOfWork.Tenant.GetAllAsync();
        }

        [HttpGet("{id}")]
        public async Task<Tenant> GetById(Guid id)
        {
            return await unitOfWork.Tenant.GetByIdAsync(id);
        }

        [HttpGet("byaccountid/{id}")]
        public async Task<IReadOnlyList<Tenant>> GetTenantByAccountId(Guid id)
        {
            return await unitOfWork.Tenant.GetTenantByAccountIdAsync(id);
        }

        [HttpGet("bylistaccountids/{ids}")]
        public async Task<IReadOnlyList<Tenant>> GetTenantByListAccountId([FromQuery] Guid[] ids)
        {
            return await unitOfWork.Tenant.GetTenantByListAccountIdAsync(ids);
        }

        [HttpPost]
        public async Task<Guid> Add(Tenant Tenant)
        {
            return await unitOfWork.Tenant.AddAsync(Tenant);
        }

        [HttpDelete("{id}")]
        public async void Delete(Guid id)
        {
            await unitOfWork.Tenant.DeleteAsync(id);

        }

        [HttpPut]
        public async void Update(Tenant Tenant)
        {
            await unitOfWork.Tenant.UpdateAsync(Tenant);
        }

        [HttpGet("bylist/{ids}")]
        public async Task<IReadOnlyList<Tenant>> GetByListId([FromQuery] Guid[] ids)
        {
            return await unitOfWork.Tenant.GetByListIdAsync(ids);
        }
    }
}
