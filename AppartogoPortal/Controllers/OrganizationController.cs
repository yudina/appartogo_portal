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
    public class OrganizationController : ControllerBase
    {
        private IUnitOfWork unitOfWork;
        public OrganizationController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<IEnumerable<Organization>> Get()
        {
            return await unitOfWork.Organization.GetAllAsync();
        }

        [HttpGet("{id}")]
        public async Task<Organization> GetById(Guid id)
        {
            return await unitOfWork.Organization.GetByIdAsync(id);
        }

        [HttpPost]
        public async Task<Guid> Add(Organization Organization)
        {
            return await unitOfWork.Organization.AddAsync(Organization);
        }

        [HttpDelete("{id}")]
        public async void Delete(Guid id)
        {
            await unitOfWork.Organization.DeleteAsync(id);

        }

        [HttpPut]
        public async void Update(Organization Organization)
        {
            await unitOfWork.Organization.UpdateAsync(Organization);
        }

        [HttpGet("bylist/{ids}")]
        public async Task<IReadOnlyList<Organization>> GetByListId([FromQuery] Guid[] ids)
        {
            return await unitOfWork.Organization.GetByListIdAsync(ids);
        }
    }
}
