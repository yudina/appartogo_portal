using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace Infrastructure.Extensions
{
    public static class CurrencyUtils
    {
        private static readonly Dictionary<string, CultureInfo> ISOCurrenciesMap =
            CultureInfo.GetCultures(CultureTypes.SpecificCultures)
                .Select(c => new { c, new RegionInfo(c.LCID).ISOCurrencySymbol })
                .GroupBy(x => x.ISOCurrencySymbol)
                .ToDictionary(g => g.Key, g => g.First().c, StringComparer.OrdinalIgnoreCase);

        public static string Format(this decimal amount, string currencyCode)
        {
            if (ISOCurrenciesMap.TryGetValue(currencyCode, out CultureInfo culture))
            {
                return string.Format(culture, "{0:C}", amount);
            }

            return amount.ToString("0.00");
        }
    }
}
