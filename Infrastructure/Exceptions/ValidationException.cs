using System;

namespace Infrastructure.Exceptions
{
    [Serializable]
    public class ValidationException : Exception, IHttpResonseMessageException
    {
        public ValidationException()
        {
        }

        public ValidationException(string httpResponseMessage)
        {
            HttpResponseMessage = httpResponseMessage;
        }

        public ValidationException(string httpResponseMessage, string message) : base(message)
        {
            HttpResponseMessage = httpResponseMessage;
        }

        public ValidationException(string httpResponseMessage, string message, Exception inner) : base(message, inner)
        {
            HttpResponseMessage = httpResponseMessage;
        }

        protected ValidationException(
          System.Runtime.Serialization.SerializationInfo info,
          System.Runtime.Serialization.StreamingContext context) : base(info, context) { }

        public string HttpResponseMessage { get; set; }
    }
}
