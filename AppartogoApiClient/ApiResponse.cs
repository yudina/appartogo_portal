using System.Collections.Generic;

namespace AppartogoApiClient
{
    public class ApiResponse<T>
    {
        public bool Success { get; private set; } = true;
        public List<Error> Errors { get; private set; } = new List<Error>();
        public T Result { get; set; }

        public class Error
        {
            public string Id { get; set; }
            public string Message { get; set; }

            internal static Error Create(string id, string message)
            {
                return new Error { Id = id, Message = message };
            }
        }

        internal void AddError(string message)
        {
            Success = false;
            Errors.Add(Error.Create(string.Empty, message));
        }

        internal void AddError(string id, string message)
        {
            Success = false;
            Errors.Add(Error.Create(id, message));
        }

        public static ApiResponse<T> SuccessResponse(T t = default)
        {
            var response = new ApiResponse<T>
            {
                Result = t
            };
            return response;
        }
    }
}