using System;

namespace Infrastructure.Exceptions
{
    [Serializable]
    public class BadRequestException : Exception, IHttpResonseMessageException
    {
        public BadRequestException()
        {
        }

        public BadRequestException(string httpResponseMessage)
        {
            HttpResponseMessage = httpResponseMessage;
        }

        public BadRequestException(string httpResponseMessage, string message) : base(message)
        {
            HttpResponseMessage = httpResponseMessage;
        }

        public BadRequestException(string httpResponseMessage, string message, Exception inner) : base(message, inner)
        {
            HttpResponseMessage = httpResponseMessage;
        }

        protected BadRequestException(
          System.Runtime.Serialization.SerializationInfo info,
          System.Runtime.Serialization.StreamingContext context) : base(info, context) { }

        public string HttpResponseMessage { get; set; }
    }
}
