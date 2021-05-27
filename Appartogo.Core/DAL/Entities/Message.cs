using System;
using System.Collections.Generic;
using System.Text;

namespace Appartogo.Core.DAL.Entities
{
    public class Message
    {
        public Guid Id                  { get; set; }
        public Guid ConversationId      { get; set; }
        public Guid SenderId            { get; set; }
        public Guid ReceiverId          { get; set; }
        public string Text              { get; set; }
        public bool HasAttachment       { get; set; }
        public DateTime SentDate        { get; set; }
        public bool IsPartOfApplication { get; set; }
        public bool WasReceived         { get; set; }
        public bool Archived            { get; set; }
    }
}
