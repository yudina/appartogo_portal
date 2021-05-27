using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Infrastructure.Repository;
using Appartogo.Core.DAL.Interfaces;
using Appartogo.Core.DAL.Entities;
using System.IO;

namespace AppartogoPortal.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly string profilePicturesPath = "Appartogoclient/src/assets/profilePictures";
        public AccountController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<IEnumerable<Account>> Get()
        {
            return await unitOfWork.Account.GetAllAsync();
        }

        [HttpGet("{id}")]
        public async Task<Account> GetById(Guid id)
        {
            return await unitOfWork.Account.GetByIdAsync(id);
        }

        [HttpGet("bylist/{ids}")]
        public async Task<IReadOnlyList<Account>> GetByListId([FromQuery] Guid[] ids)
        {
            return await unitOfWork.Account.GetByListIdAsync(ids);
        }

        [HttpPost]
        public async Task<Guid> Add(Account account)
        {
            return account.Id == Guid.Empty ? account.Id : await unitOfWork.Account.AddAsync(account);
        }

        [HttpPost("profilepic")]
        public async Task<Account> AddPicture([FromForm] Account account)
        {
            
            if (account.Id == Guid.Empty)
            {
                return null;
            }
            Account accountDb = await GetById(account.Id);
            if (!(accountDb is null)) {
                string filename = account.Id.ToString();
                string extension = Path.GetExtension(account.ImageFile.FileName);
                string path = Path.Combine(profilePicturesPath, filename + extension);
                using (var fileStream = new FileStream(path, FileMode.Create))
                {
                    await account.ImageFile.CopyToAsync(fileStream);
                }
                if (System.IO.File.Exists(path))
                {
                    accountDb.ProfilePictureUrl = path;
                    Update(accountDb);
                    return accountDb;
                }
                

            }
            
            return null;
        }

        [HttpGet("deleteprofilepic/{id}")]
        public async Task<Account> DeletePicture(Guid id)
        {

            if (id == Guid.Empty)
            {
                return null;
            }
            Account accountDb = await GetById(id);
            if ((!(accountDb is null)) && (!String.IsNullOrEmpty(accountDb.ProfilePictureUrl)))
            {
                if (System.IO.File.Exists(accountDb.ProfilePictureUrl))
                {
                    System.IO.File.Delete(accountDb.ProfilePictureUrl);
                }   
                accountDb.ProfilePictureUrl = null;
                Update(accountDb);
                return accountDb;  

            }

            return null;
        }

        [HttpDelete("{id}")]
        public async void Delete(Guid id)
        {
            await unitOfWork.Account.DeleteAsync(id);

        }

        [HttpPut]
        public async void Update(Account account)
        {
            await unitOfWork.Account.UpdateAsync(account);
        }
    }
}
