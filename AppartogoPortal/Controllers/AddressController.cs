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
    public class AddressController : ControllerBase
    {

        private IUnitOfWork unitOfWork;
        public AddressController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<IEnumerable<Address>> Get()
        {
            return await unitOfWork.Address.GetAllAsync();
        }

        [HttpGet("{id}")]
        public async Task<Address> GetById(Guid id)
        {
            return await unitOfWork.Address.GetByIdAsync(id);
        }

        [HttpPost]
        public async Task<Guid> Add(Address Address)
        {
            return await unitOfWork.Address.AddAsync(Address);
        }

        [HttpDelete("{id}")]
        public async void Delete(Guid id)
        {
            await unitOfWork.Address.DeleteAsync(id);

        }

        [HttpPut]
        public async void Update(Address Address)
        {
            await unitOfWork.Address.UpdateAsync(Address);
        }

        [HttpGet("bylist/{ids}")]
        public async Task<IReadOnlyList<Address>> GetByListId([FromQuery] Guid[] ids)
        {
            return await unitOfWork.Address.GetByListIdAsync(ids);
        }
    }
}
