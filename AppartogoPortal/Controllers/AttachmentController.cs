using Appartogo.Core.DAL.Entities;
using Appartogo.Core.DAL.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;

namespace AppartogoPortal.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AttachmentController : ControllerBase
    {

        private IUnitOfWork unitOfWork;
        private readonly string directoryPathListingPictures = "Appartogoclient/src/assets/listingPictures";
        private readonly string directoryPathOtherAttachments = "Appartogoclient/src/assets/Attachments";
        public AttachmentController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<IEnumerable<Attachment>> Get()
        {
            return GetAllAttachments(await unitOfWork.Attachment.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<Attachment> GetById(Guid id)
        {
            var attachment = await unitOfWork.Attachment.GetByIdAsync(id);
            if (!(attachment is null))
            {
                return attachment.ListingId != Guid.Empty ? GetAttachment(attachment, directoryPathListingPictures) : GetAttachment(attachment, directoryPathOtherAttachments);
            }
            return attachment;
            
        }

        [HttpPost]
        public async Task<Guid> Add([FromForm] Attachment attachment)
        {
            attachment.Id = await unitOfWork.Attachment.AddAsync(attachment);
            attachment = attachment.ListingId != Guid.Empty ? await AddAttachment(attachment, directoryPathListingPictures) : await AddAttachment(attachment, directoryPathOtherAttachments);
            return attachment is null ? Guid.Empty : attachment.Id;
        }

        [HttpDelete("{id}")]
        public async void Delete(Guid id)
        {
            Attachment attachmentDb = await unitOfWork.Attachment.GetByIdAsync(id);
            if (!(attachmentDb is null))
            {
                await unitOfWork.Attachment.DeleteAsync(attachmentDb.Id);
                if (attachmentDb.ListingId != Guid.Empty)
                {
                    DeleteAttachment(attachmentDb.Id, directoryPathListingPictures);
                }
                else
                {
                    DeleteAttachment(attachmentDb.Id, directoryPathOtherAttachments);
                }
                
                
            }

        }

        [HttpPut]
        public async void Update([FromForm] Attachment attachment)
        {
            Attachment attachmentDb = await unitOfWork.Attachment.GetByIdAsync(attachment.Id);
            if (!(attachmentDb is null))
            {
                var att = attachment.ListingId != Guid.Empty ? await AddAttachment(attachment, directoryPathListingPictures) : await AddAttachment(attachment, directoryPathOtherAttachments);
                await unitOfWork.Attachment.UpdateAsync(att);
            }

        }

        [HttpGet("bylist/{ids}")]
        public async Task<IReadOnlyList<Attachment>> GetByListId([FromQuery] Guid[] ids)
        {
            return GetAllAttachments(await unitOfWork.Attachment.GetByListIdAsync(ids));
        }

        [HttpGet("bylistingid/{id}")]
        public async Task<IReadOnlyList<Attachment>> GetAttachmentByListingId(Guid id)
        {
            return GetAllAttachments(await unitOfWork.Attachment.GetAttachmentByListingIdAsync(id));
        }

        [HttpGet("bylistlistingids/{ids}")]
        public async Task<IReadOnlyList<Attachment>> GetAttachmentByListListingId([FromQuery] Guid[] ids)
        {
            return GetAllAttachments(await unitOfWork.Attachment.GetAttachmentByListListingIdAsync(ids));
        }

        [HttpGet("byapplicationid/{id}")]
        public async Task<IReadOnlyList<Attachment>> GetAttachmentByApplicationId(Guid id)
        {
            return GetAllAttachments(await unitOfWork.Attachment.GetAttachmentByApplicationIdAsync(id));
        }

        [HttpGet("bylistapplicationids/{ids}")]
        public async Task<IReadOnlyList<Attachment>> GetAttachmentByListApplicationId([FromQuery] Guid[] ids)
        {
            return GetAllAttachments(await unitOfWork.Attachment.GetAttachmentByListApplicationIdAsync(ids));
        }

        [HttpGet("bymessageid/{id}")]
        public async Task<IReadOnlyList<Attachment>> GetAttachmentByMessageId(Guid id)
        {
            return GetAllAttachments(await unitOfWork.Attachment.GetAttachmentByMessageIdAsync(id));
        }

        #region private methods

        private async Task<Attachment> AddAttachment(Attachment attachment, string filePath)
        {
            string filename = attachment.Id.ToString();
            string extension = Path.GetExtension(attachment.AttachmentFile.FileName);
            string path = Path.Combine(filePath, filename + extension);
            using (var fileStream = new FileStream(path, FileMode.Create))
            {
                await attachment.AttachmentFile.CopyToAsync(fileStream);
            }
            if (System.IO.File.Exists(path))
            {
                return attachment;
            }
            return null;
        }

        private void DeleteAttachment(Guid id, string filePath)
        {
            if (id != Guid.Empty)
            {
                DirectoryInfo attachmentsDirectory = new DirectoryInfo(filePath);
                FileInfo[] filesInDir = attachmentsDirectory.GetFiles(id.ToString() + ".*");
                if (filesInDir.Any())
                {
                    System.IO.File.Delete(filesInDir.FirstOrDefault().FullName);
                }

            }
        }

        private Attachment GetAttachment(Attachment attachment, string filePath)
        {
            DirectoryInfo attachmentsDirectory = new DirectoryInfo(filePath);
            FileInfo[] filesInDir = attachmentsDirectory.GetFiles(attachment.Id.ToString() + ".*");
            if (filesInDir.Any())
            {
                attachment.PathFile = filesInDir.FirstOrDefault().FullName;
                return attachment;
            }
            return null;
        }

        private IReadOnlyList<Attachment> GetAllAttachments(IReadOnlyList<Attachment> attachments)
        {
            List<Attachment> Updatedattachments = new List<Attachment>();
            foreach (var att in attachments)
            {
                Updatedattachments.Add(att.ListingId != Guid.Empty ? GetAttachment(att, directoryPathListingPictures) : GetAttachment(att, directoryPathOtherAttachments));
            }
            return Updatedattachments;
        }

        #endregion
    }
}
