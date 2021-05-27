using System;

namespace Infrastructure.Exceptions
{
    [Serializable]
    public class ForbiddenException : Exception, IHttpResonseMessageException
    {
        public ForbiddenException()
        {
        }

        public ForbiddenException(string httpResponseMessage)
        {
            HttpResponseMessage = httpResponseMessage;
        }

        public ForbiddenException(string httpResponseMessage, string message) : base(message)
        {
            HttpResponseMessage = httpResponseMessage;
        }

        public ForbiddenException(string httpResponseMessage, string message, Exception inner) : base(message, inner)
        {
            HttpResponseMessage = httpResponseMessage;
        }

        protected ForbiddenException(
          System.Runtime.Serialization.SerializationInfo info,
          System.Runtime.Serialization.StreamingContext context) : base(info, context) { }

        public string HttpResponseMessage { get; set; }
    }
}