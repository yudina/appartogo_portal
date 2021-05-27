using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace Appartogo.Core.DAL.Entities
{
    public class Attachment
    {
        public Guid Id                  { get; set; }
        public Guid MessageId           { get; set; }
        public Guid ApplicationId       { get; set; }
        public Guid ListingId           { get; set; }
        public string Name              { get; set; }
        public string Type              { get; set; }
        public IFormFile AttachmentFile { get; set; }
        public string PathFile          { get; set; }
    }
}
