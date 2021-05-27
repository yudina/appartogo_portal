using System.IO;
using System.Text;

namespace Infrastructure.Extensions
{
    public static class StreamUtils
    {
        public static Stream ToStream(this string text)
        {
            var ms = new MemoryStream(Encoding.UTF8.GetBytes(text));
            ms.Seek(0, SeekOrigin.Begin);
            return ms;
        }

        public static byte[] ToBytes(Stream input)
        {
            using (var ms = new MemoryStream())
            {
                input.CopyTo(ms);
                return ms.ToArray();
            }
        }
    }
}