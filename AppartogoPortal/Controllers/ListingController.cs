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
    public class ListingController : ControllerBase
    {

        private IUnitOfWork unitOfWork;
        public ListingController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<IEnumerable<Listing>> Get()
        {
            return await unitOfWork.Listing.GetAllAsync();
        }

        [HttpGet("unarchived")]
        public async Task<IReadOnlyList<Listing>> GetAllUnarchived()
        {
            return await unitOfWork.Listing.GetAllUnarchivedAsync();
        }

        [HttpGet("{id}")]
        public async Task<Listing> GetById(Guid id)
        {
            return await unitOfWork.Listing.GetByIdAsync(id);
        }

        [HttpGet("byapartmentid/{id}")]
        public async Task<IReadOnlyList<Listing>> GetListingByApartmentId(Guid id)
        {
            return await unitOfWork.Listing.GetListingByApartmentIdAsync(id);
        }

        [HttpGet("bylistapartmentids/{ids}")]
        public async Task<IReadOnlyList<Listing>> GetListingByListApartmentId([FromQuery] Guid[] ids)
        {
            return await unitOfWork.Listing.GetListingByListApartmentIdAsync(ids);
        }

        [HttpPost]
        public async Task<Guid> Add(Listing Listing)
        {
            return await unitOfWork.Listing.AddAsync(Listing);
        }

        [HttpDelete("{id}")]
        public async void Delete(Guid id)
        {
            await unitOfWork.Listing.DeleteAsync(id);

        }

        [HttpPut]
        public async void Update(Listing Listing)
        {
            await unitOfWork.Listing.UpdateAsync(Listing);
        }

        [HttpGet("bylist/{ids}")]
        public async Task<IReadOnlyList<Listing>> GetByListId([FromQuery] Guid[] ids)
        {
            return await unitOfWork.Listing.GetByListIdAsync(ids);
        }
    }
}
