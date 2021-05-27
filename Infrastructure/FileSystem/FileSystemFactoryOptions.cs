using System.Collections.Generic;

namespace Infrastructure.FileSystem
{
    public class FileSystemFactoryOptions
    {
        public FileSystemFactoryOptions()
        {
            FileSystemConfigurations = new Dictionary<string, FileSystemConfiguration>();
        }

        public Dictionary<string, FileSystemConfiguration> FileSystemConfigurations { get; set; }
    }
}
