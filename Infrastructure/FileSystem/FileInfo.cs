using System;

namespace Infrastructure.FileSystem
{
    public class FileInfo
    {
        public long Size { get; set; }
        public DateTime LastModified { get; set; }
        public DateTime Created { get; set; }
    }
}