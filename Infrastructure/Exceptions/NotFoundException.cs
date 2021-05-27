using System;

namespace Infrastructure.Exceptions
{
    [Serializable]
    public class NotFoundException : Exception, IHttpResonseMessageException
    {
        public NotFoundException()
        {
        }

        public NotFoundException(string httpResponseMessage)
        {
            HttpResponseMessage = httpResponseMessage;
        }

        public NotFoundException(string httpResponseMessage, string message) : base(message)
        {
            HttpResponseMessage = httpResponseMessage;
        }

        public NotFoundException(string httpResponseMessage, string message, Exception inner) : base(message, inner)
        {
            HttpResponseMessage = httpResponseMessage;
        }

        protected NotFoundException(
          System.Runtime.Serialization.SerializationInfo info,
          System.Runtime.Serialization.StreamingContext context) : base(info, context) { }

        public string HttpResponseMessage { get; set; }
    }
}
