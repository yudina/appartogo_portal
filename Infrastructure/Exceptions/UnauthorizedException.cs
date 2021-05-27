using System;

namespace Infrastructure.Exceptions
{
    public class UnauthorizedException : Exception
    {
        public UnauthorizedException()
        {
        }

        public UnauthorizedException(string httpResponseMessage)
        {
            HttpResponseMessage = httpResponseMessage;
        }

        public UnauthorizedException(string httpResponseMessage, string message) : base(message)
        {
            HttpResponseMessage = httpResponseMessage;
        }

        public UnauthorizedException(string httpResponseMessage, string message, Exception inner) : base(message, inner)
        {
            HttpResponseMessage = httpResponseMessage;
        }

        protected UnauthorizedException(
          System.Runtime.Serialization.SerializationInfo info,
          System.Runtime.Serialization.StreamingContext context) : base(info, context) { }

        public string HttpResponseMessage { get; set; }
    }
}