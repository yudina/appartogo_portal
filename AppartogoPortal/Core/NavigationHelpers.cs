using Microsoft.AspNetCore.Mvc;

namespace AppartogoPortal.Core
{
    public static class NavigationHelpers
    {
        public static string AlternateUrl(this IUrlHelper url)
        {
            var language = url.ActionContext.HttpContext.Request.GetLanguage();
            var alternateLanguage = GetAlternateLanguage(language);

            //Check in the RouteData for constrained based routing
            if (url.ActionContext.RouteData.Values.TryGetValue($"url-{alternateLanguage}", out var resolvedUrl))
                return resolvedUrl.ToString();

            //Home url
            if (alternateLanguage == "fr")
                return "/";
            return $"/{alternateLanguage}";
        }

        public static string AlternateLanguage(this IUrlHelper url)
        {
            var language = url.ActionContext.HttpContext.Request.GetLanguage();
            return GetAlternateLanguage(language);
        }

        public static string Build(this IUrlHelper url, string postfix)
        {
            var language = url.ActionContext.HttpContext.Request.GetLanguage();

            if (language == "fr")
                return postfix;
            if (postfix == "/")
                return $"/{language}";
            return $"/{language}{(postfix.StartsWith("/") ? string.Empty : "/")}{postfix}";
        }

        public static string GetAlternateLanguage(string language)
        {
            return language == "fr" ? "en" : "fr";
        }
    }
}