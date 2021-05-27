using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Localize
{
    public class Localized<T> : WildcardDictionary<T>
    {
        public static Localized<T> Default(T value)
        {
            return new Localized<T>
            {
                { "*", value }
            };
        }

        public static Localized<T> CreateFrEn(T fr, T en)
        {
            var dict = new Dictionary<string, T>
            {
                { "en", en },
                { "*", fr }
            };
            return FromList(dict);
        }

        public static Localized<string> EmptyString()
        {
            return Localized<string>.Default(string.Empty);
        }

        public static Localized<string> FromJObject(JObject obj)
        {
            if (obj == null)
                return EmptyString();

            var localize = new Localized<string>();
            foreach (var o in obj)
                localize.Add(o.Key, o.Value.Value<string>());
            return localize;
        }

        public static Localized<T> FromList(IDictionary<string, T> dict)
        {
            var localize = new Localized<T>();
            foreach (var kvp in dict)
                localize.Add(kvp.Key, kvp.Value);
            return localize;
        }

        public override string ToString()
        {
            var sb = new StringBuilder();
            foreach (var key in Keys)
            {
                if (sb.Length > 0)
                    sb.Append(", ");
                sb.Append(key + "=" + this[key]);
            }
            return "{" + sb.ToString() + "}";
        }
    }
}