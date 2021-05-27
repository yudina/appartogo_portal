using Infrastructure.Localize;
using System;
using System.Collections.Generic;

namespace Infrastructure.Resources
{
    public class ResourceCollection
    {
        private IDictionary<string, Localized<string>> values;

        public ResourceCollection(IDictionary<string, Localized<string>> resources)
        {
            if (resources == null)
                throw new ArgumentNullException(nameof(resources));

            values = resources;
        }

        public bool HasKey(string key)
        {
            return values.ContainsKey(key);
        }

        public string Get(string key, string language, params object[] parameters)
        {
            if (!values.TryGetValue(key, out var localizeString))
                return $"{{{language}:{key}}}";

            string value = localizeString[language];

            if (parameters.Length > 0)
                string.Format(value, parameters);

            return value;
        }

        public IDictionary<string, string> GetAll(string language)
        {
            var result = new Dictionary<string, string>();
            foreach (var key in values.Keys)
                result[key] = values[key][language];
            return result;
        }
    }
}
