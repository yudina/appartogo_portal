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
    public class ApartmentController : ControllerBase
    {

        private IUnitOfWork unitOfWork;
        public ApartmentController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<IEnumerable<Apartment>> Get()
        {
            return await unitOfWork.Apartment.GetAllAsync();
        }

        [HttpGet("unarchived")]
        public async Task<IReadOnlyList<Apartment>> GetAllUnarchived()
        {
            return await unitOfWork.Apartment.GetAllUnarchivedAsync();
        }

        [HttpGet("{id}")]
        public async Task<Apartment> GetById(Guid id)
        {
            return await unitOfWork.Apartment.GetByIdAsync(id);
        }

        [HttpGet("bypropertyid/{id}")]
        public async Task<IReadOnlyList<Apartment>> GetApartmentByPropertyId(Guid id)
        {
            return await unitOfWork.Apartment.GetApartmentByPropertyIdAsync(id);
        }

        [HttpGet("bylistpropertyids/{ids}")]
        public async Task<IReadOnlyList<Apartment>> GetApartmentByListPropertyId([FromQuery] Guid[] ids)
        {
            return await unitOfWork.Apartment.GetApartmentByListPropertyIdAsync(ids);
        }

        [HttpGet("unarchivedbylistpropertyids/{ids}")]
        public async Task<IReadOnlyList<Apartment>> GetApartmentByListPropertyIdUnarchived([FromQuery] Guid[] ids)
        {
            return await unitOfWork.Apartment.GetApartmentByListPropertyIdUnarchivedAsync(ids);
        }

        [HttpGet("bytenant/{id}")]
        public async Task<IReadOnlyList<Apartment>> GetApartmentByTenantId(Guid id)
        {
            return await unitOfWork.Apartment.GetApartmentByTenantIdAsync(id);
        }

        [HttpPost]
        public async Task<Guid> Add(Apartment Apartment)
        {
            return await unitOfWork.Apartment.AddAsync(Apartment);
        }

        [HttpDelete("{id}")]
        public async void Delete(Guid id)
        {
            await unitOfWork.Apartment.DeleteAsync(id);

        }

        [HttpPut]
        public async void Update(Apartment Apartment)
        {
            await unitOfWork.Apartment.UpdateAsync(Apartment);
        }

        [HttpGet("bylist/{ids}")]
        public async Task<IReadOnlyList<Apartment>> GetByListId([FromQuery] Guid[] ids)
        {
            return await unitOfWork.Apartment.GetByListIdAsync(ids);
        }
    }
}
