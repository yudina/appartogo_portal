using Infrastructure.Resources;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Localization;
using System;
using System.Collections.Generic;
using System.Globalization;

namespace AppartogoPortal.Core
{
    public class ResourceManagerStringLocalizer : IStringLocalizer
    {
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IResourceService resourceService;

        public ResourceManagerStringLocalizer(IHttpContextAccessor httpContextAccessor, IResourceService resourceService)
        {
            if (httpContextAccessor == null)
                throw new ArgumentNullException(nameof(httpContextAccessor));
            if (resourceService == null)
                throw new ArgumentNullException(nameof(resourceService));

            this.httpContextAccessor = httpContextAccessor;
            this.resourceService = resourceService;
        }

        public LocalizedString this[string name] => GetValue(name);

        public LocalizedString this[string name, params object[] arguments] => GetValue(name, arguments);

        public IEnumerable<LocalizedString> GetAllStrings(bool includeParentCultures)
        {
            var language = httpContextAccessor.HttpContext.Request.GetLanguage();

            var result = new List<LocalizedString>();
            var resourceCollection = resourceService.GetResourcesAsync().Result;
            foreach (var entry in resourceCollection.GetAll(language))
                result.Add(new LocalizedString(entry.Key, entry.Value));
            return result;
        }

        public IStringLocalizer WithCulture(CultureInfo culture)
        {
            throw new System.NotImplementedException();
        }

        private LocalizedString GetValue(string name, params object[] arguments)
        {
            var language = httpContextAccessor.HttpContext.Request.GetLanguage();

            var resourceCollection = resourceService.GetResourcesAsync().Result;
            var value = resourceCollection.Get(name, language, arguments);

            return new LocalizedString(name, value);
        }
    }
}