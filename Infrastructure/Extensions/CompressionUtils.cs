﻿using System.IO;
using System.IO.Compression;

namespace Infrastructure.Extensions
{
    public static class CompressionUtils
    {
        public static byte[] Decompress(byte[] gzip)
        {
            using (var stream = new GZipStream(new MemoryStream(gzip), CompressionMode.Decompress))
            {
                const int size = 4096;
                byte[] buffer = new byte[size];
                using (var memory = new MemoryStream())
                {
                    int count = 0;
                    do
                    {
                        count = stream.Read(buffer, 0, size);
                        if (count > 0)
                            memory.Write(buffer, 0, count);
                    }
                    while (count > 0);
                    return memory.ToArray();
                }
            }
        }
    }
}