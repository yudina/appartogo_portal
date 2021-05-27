using Infrastructure.Localize;
using System;
using System.Collections.Generic;

namespace Infrastructure.Extensions
{
    public static class DateTimeUtils
    {
        public static readonly List<Localized<string>> Months = new List<Localized<string>>
        {
            Localized<string>.CreateFrEn("Janvier", "January"),
            Localized<string>.CreateFrEn("Février", "February"),
            Localized<string>.CreateFrEn("Mars", "March"),
            Localized<string>.CreateFrEn("Avril", "April"),
            Localized<string>.CreateFrEn("Mai", "May"),
            Localized<string>.CreateFrEn("Juin", "June"),
            Localized<string>.CreateFrEn("Juillet", "July"),
            Localized<string>.CreateFrEn("Août", "August"),
            Localized<string>.CreateFrEn("Septembre", "September"),
            Localized<string>.CreateFrEn("Octobre", "October"),
            Localized<string>.CreateFrEn("Novembre", "November"),
            Localized<string>.CreateFrEn("Décembre", "December")
        };

        public static string GetMonth(int month, string language)
        {
            return Months[month - 1][language];
        }

        public static string ElapsedTimeFormatted(TimeSpan ts)
        {
            if (ts.Days > 0)
                return $"{ts.Days}d{ts.Hours}h{ts.Minutes}m{ts.Seconds}s";
            if (ts.Hours > 0)
                return $"{ts.Hours}h{ts.Minutes}m{ts.Seconds}s";
            if (ts.Minutes > 0)
                return $"{ts.Minutes}m{ts.Seconds}s";
            return $"{ts.Seconds}s";
        }

        public static DateTime ToEst(DateTime dt)
        {
            return TimeZoneInfo.ConvertTimeFromUtc(dt, TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time"));
        }

        public static DateTime NowToEst()
        {
            return ToEst(DateTime.UtcNow);
        }

        public static string SinceText(DateTimeOffset dt, string language)
        {
            var offset = DateTimeOffset.UtcNow.Subtract(dt.ToUniversalTime());

            int seconds = (int)offset.TotalSeconds;
            if (seconds < 60)
                return language == "fr" ? "Maintenant" : "Just now";
            if (seconds < 120)
                return language == "fr" ? "Il y a une minute" : "1 minute ago";
            if (seconds < 3600)
            {
                var minutes = (int)(seconds / 60);
                return language == "fr" ? $"Il y a {minutes} minutes" : $"{minutes} minutes ago";
            }
            if (seconds < 7200)
                return language == "fr" ? "Il y a 1 heure" : "1 hour ago";
            if (seconds < 86400)
            {
                var hours = (int)(seconds / 3600);
                return language == "fr" ? $"Il y a {hours} heures" : $"{hours} hours ago";
            }

            var days = (int)offset.TotalDays;
            if (days == 1)
                return language == "fr" ? $"Hier" : $"Yesterday";
            if (days < 7)
                return language == "fr" ? $"Il y a {days} jours" : $"{days} days ago";

            var weeks = (int)(days / 7);
            if (weeks == 1)
                return language == "fr" ? $"Il y a 1 semaine" : $"1 week ago";
            return language == "fr" ? $"Il y a {weeks} semaines" : $"{weeks} weeks ago";
        }
    }
}