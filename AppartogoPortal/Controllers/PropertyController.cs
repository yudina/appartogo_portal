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
    public class PropertyController : ControllerBase
    {

        private IUnitOfWork unitOfWork;
        public PropertyController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<IEnumerable<Property>> Get()
        {
            return await unitOfWork.Property.GetAllAsync();
        }

        [HttpGet("unarchived")]
        public async Task<IReadOnlyList<Property>> GetAllUnarchived()
        {
            return await unitOfWork.Property.GetAllUnarchivedAsync();
        }

        [HttpGet("{id}")]
        public async Task<Property> GetById(Guid id)
        {
            return await unitOfWork.Property.GetByIdAsync(id);
        }

        [HttpGet("byorganizationid/{id}")]
        public async Task<IReadOnlyList<Property>> GetPropertyByOrganizationId(Guid id)
        {
            return await unitOfWork.Property.GetPropertyByOrganizationIdAsync(id);
        }

        [HttpGet("unarchivedbyorganizationid/{id}")]
        public async Task<IReadOnlyList<Property>> GetPropertyByOrganizationIdUnarchived(Guid id)
        {
            return await unitOfWork.Property.GetPropertyByOrganizationIdUnarchivedAsync(id);
        }

        [HttpGet("bylistorganizationids/{ids}")]
        public async Task<IReadOnlyList<Property>> GetPropertyByListOrganizationId([FromQuery] Guid[] ids)
        {
            return await unitOfWork.Property.GetPropertyByListOrganizationIdAsync(ids);
        }

        [HttpPost]
        public async Task<Guid> Add(Property Property)
        {
            return await unitOfWork.Property.AddAsync(Property);
        }

        [HttpDelete("{id}")]
        public async void Delete(Guid id)
        {
            await unitOfWork.Property.DeleteAsync(id);

        }

        [HttpPut]
        public async void Update(Property Property)
        {
            await unitOfWork.Property.UpdateAsync(Property);
        }

        [HttpGet("bylist/{ids}")]
        public async Task<IReadOnlyList<Property>> GetByListId([FromQuery] Guid[] ids)
        {
            return await unitOfWork.Property.GetByListIdAsync(ids);
        }
    }
}
