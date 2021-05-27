using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace Infrastructure.Extensions
{
    public static class StringUtils
    {
        private static readonly Dictionary<string, string> foreign_characters = new Dictionary<string, string>
        {
            { "äæǽ", "ae" },
            { "öœ", "oe" },
            { "ü", "ue" },
            { "Ä", "Ae" },
            { "Ü", "Ue" },
            { "Ö", "Oe" },
            { "ÀÁÂÃÄÅǺĀĂĄǍΑΆẢẠẦẪẨẬẰẮẴẲẶА", "A" },
            { "àáâãåǻāăąǎªαάảạầấẫẩậằắẵẳặа", "a" },
            { "Б", "B" },
            { "б", "b" },
            { "ÇĆĈĊČ", "C" },
            { "çćĉċč", "c" },
            { "Д", "D" },
            { "д", "d" },
            { "ÐĎĐΔ", "Dj" },
            { "ðďđδ", "dj" },
            { "ÈÉÊËĒĔĖĘĚΕΈẼẺẸỀẾỄỂỆЕЭ", "E" },
            { "èéêëēĕėęěέεẽẻẹềếễểệеэ", "e" },
            { "Ф", "F" },
            { "ф", "f" },
            { "ĜĞĠĢΓГҐ", "G" },
            { "ĝğġģγгґ", "g" },
            { "ĤĦ", "H" },
            { "ĥħ", "h" },
            { "ÌÍÎÏĨĪĬǏĮİΗΉΊΙΪỈỊИЫ", "I" },
            { "ìíîïĩīĭǐįıηήίιϊỉịиыї", "i" },
            { "Ĵ", "J" },
            { "ĵ", "j" },
            { "ĶΚК", "K" },
            { "ķκк", "k" },
            { "ĹĻĽĿŁΛЛ", "L" },
            { "ĺļľŀłλл", "l" },
            { "М", "M" },
            { "м", "m" },
            { "ÑŃŅŇΝН", "N" },
            { "ñńņňŉνн", "n" },
            { "ÒÓÔÕŌŎǑŐƠØǾΟΌΩΏỎỌỒỐỖỔỘỜỚỠỞỢО", "O" },
            { "òóôõōŏǒőơøǿºοόωώỏọồốỗổộờớỡởợо", "o" },
            { "П", "P" },
            { "п", "p" },
            { "ŔŖŘΡР", "R" },
            { "ŕŗřρр", "r" },
            { "ŚŜŞȘŠΣС", "S" },
            { "śŝşșšſσςс", "s" },
            { "ȚŢŤŦτТ", "T" },
            { "țţťŧт", "t" },
            { "ÙÚÛŨŪŬŮŰŲƯǓǕǗǙǛŨỦỤỪỨỮỬỰУ", "U" },
            { "ùúûũūŭůűųưǔǖǘǚǜυύϋủụừứữửựу", "u" },
            { "ÝŸŶΥΎΫỲỸỶỴЙ", "Y" },
            { "ýÿŷỳỹỷỵй", "y" },
            { "В", "V" },
            { "в", "v" },
            { "Ŵ", "W" },
            { "ŵ", "w" },
            { "ŹŻŽΖЗ", "Z" },
            { "źżžζз", "z" },
            { "ÆǼ", "AE" },
            { "ß", "ss" },
            { "Ĳ", "IJ" },
            { "ĳ", "ij" },
            { "Œ", "OE" },
            { "ƒ", "f" },
            { "ξ", "ks" },
            { "π", "p" },
            { "β", "v" },
            { "μ", "m" },
            { "ψ", "ps" },
            { "Ё", "Yo" },
            { "ё", "yo" },
            { "Є", "Ye" },
            { "є", "ye" },
            { "Ї", "Yi" },
            { "Ж", "Zh" },
            { "ж", "zh" },
            { "Х", "Kh" },
            { "х", "kh" },
            { "Ц", "Ts" },
            { "ц", "ts" },
            { "Ч", "Ch" },
            { "ч", "ch" },
            { "Ш", "Sh" },
            { "ш", "sh" },
            { "Щ", "Shch" },
            { "щ", "shch" },
            { "ЪъЬь", "" },
            { "Ю", "Yu" },
            { "ю", "yu" },
            { "Я", "Ya" },
            { "я", "ya" },
        };

        public static string NormalizeForUri(this string text)
        {
            if (text == null)
                return string.Empty;

            var dashInserted = false;
            var sb = new StringBuilder(text.Length);
            foreach (var c in text)
            {
                if (char.IsLetter(c))
                {
                    sb.Append(RemoveDiacritics(char.ToLower(c)));
                    dashInserted = false;
                }
                else if (char.IsDigit(c))
                {
                    sb.Append(c);
                    dashInserted = false;
                }
                else if (c == '/')
                {
                    if (dashInserted)
                        sb.Remove(sb.Length - 1, 1);    //Remove the dash before the slash
                    else
                        dashInserted = true;
                    sb.Append(c);
                }
                else
                {
                    if (!dashInserted)
                    {
                        sb.Append('-');
                        dashInserted = true;
                    }
                }
            }

            var uri = sb.ToString();
            if (uri.EndsWith('/'))
                return uri.Substring(0, uri.Length - 1);

            return uri;
        }

        public static string NormalizeComponentForUri(this string text)
        {
            if (text == null)
                return string.Empty;

            var dashInserted = false;
            var sb = new StringBuilder(text.Length);
            foreach (var c in text)
            {
                if (char.IsLetter(c))
                {
                    sb.Append(RemoveDiacritics(char.ToLower(c)));
                    dashInserted = false;
                }
                else if (char.IsDigit(c))
                {
                    sb.Append(c);
                    dashInserted = false;
                }
                else
                {
                    if (!dashInserted)
                    {
                        sb.Append('-');
                        dashInserted = true;
                    }
                }
            }

            var uri = sb.ToString();
            if (uri.EndsWith('/') || uri.EndsWith('-'))
                return uri.Substring(0, uri.Length - 1);

            return uri;
        }

        public static char RemoveDiacritics(this char c)
        {
            foreach (var entry in foreign_characters)
            {
                if (entry.Key.IndexOf(c) != -1)
                    return entry.Value[0];
            }
            return c;
        }

        public static string RemoveDiacritics(this string s)
        {
            var sb = new StringBuilder(s.Length);
            foreach (var c in s)
                sb.Append(RemoveDiacritics(c));
            return sb.ToString();
        }

        public static string ToInvariant(string text)
        {
            if (text == null)
                return null;

            return RemoveDiacritics(text.ToLower());
        }

        public static string StripHtml(string input)
        {
            if (string.IsNullOrEmpty(input))
                return string.Empty;

            return Regex.Replace(input, "<.*?>", string.Empty);
        }
    }
}