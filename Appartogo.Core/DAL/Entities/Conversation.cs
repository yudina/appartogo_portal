using System;
using System.Collections.Generic;
using System.Text;

namespace Appartogo.Core.DAL.Entities
{
    public class Conversation
    {
        public Guid Id                  { get; set; }
        public Guid ListingId           { get; set; }
        public Guid CreatedById         { get; set; }
        public Guid OtherParticipantId  { get; set; }
        public bool Archived            { get; set; }
    }
}
