using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace Appartogo.Core.DAL.Entities
{
    public class Account
    {
        public Guid Id                  { get; set; }
        public Guid AddressId           { get; set; }
        public string Email             { get; set; }
        public string FirstName         { get; set; }
        public string LastName          { get; set; }
        public string PhoneNumber       { get; set; }
        public string ProfilePictureUrl { get; set; }
        public IFormFile ImageFile      { get; set; }
    }
}
