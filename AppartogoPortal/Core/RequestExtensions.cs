using Microsoft.AspNetCore.Http;

namespace AppartogoPortal.Core
{
    public static class RequestExtensions
    {
        public static string GetInfo(this HttpRequest request)
        {
            return $"{request.Method} {request.Scheme}://{request.Host}{request.Path}{request.QueryString}";
        }

        public static string GetFullUrl(this HttpRequest request)
        {
            var uri = $"{request.Scheme}://{request.Host}{request.Path}{request.QueryString}";
            if (uri.EndsWith("/"))
                uri = uri.Substring(0, uri.Length - 1);
            return uri;
        }

        public static string GetLanguage(this HttpRequest request)
        {
            if (request.Path.ToString().ToLower().StartsWith("/en"))
                return "en";
            return "fr";
        }
    }
}