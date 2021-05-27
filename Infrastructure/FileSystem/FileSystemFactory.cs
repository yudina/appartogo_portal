using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;

namespace Infrastructure.FileSystem
{
    public class FileSystemFactory : IFileSystemFactory
    {
        private static readonly object Lock = new object();
        private readonly Dictionary<string, FileSystemConfiguration> fileSystemConfigurations;
        private readonly Dictionary<string, IFileSystem> fileSystems = new Dictionary<string, IFileSystem>();

        public FileSystemFactory(IOptions<FileSystemFactoryOptions> options)
        {
            fileSystemConfigurations = options.Value.FileSystemConfigurations;
        }

        public IFileSystem Get(string name)
        {
            //First search into the cached fileSystems
            if (fileSystems.TryGetValue(name, out var fileSystem))
                return fileSystem;

            //Create the fileSystem
            lock (Lock)
            {
                if (fileSystems.TryGetValue(name, out fileSystem))
                    return fileSystem;

                if (fileSystemConfigurations.TryGetValue(name, out var fileSystemConfiguration))
                {
                    fileSystem = Create(fileSystemConfiguration);
                    fileSystems.Add(name, fileSystem);
                    return fileSystem;
                }
            }

            throw new Exception($"FileSystem '{name}' is not defined in the application bootstrap.");
        }

        public int Count()
        {
            return fileSystems.Count;
        }

        public override string ToString()
        {
            return fileSystems.Count.ToString();
        }

        private static IFileSystem Create(FileSystemConfiguration fileSystemConfiguration)
        {
            if (fileSystemConfiguration.Type == FileSystemType.Disk)
                return new FileSystemDisk(fileSystemConfiguration);
            if (fileSystemConfiguration.Type == FileSystemType.Azure)
                return new FileSystemAzure(fileSystemConfiguration);

            throw new ArgumentOutOfRangeException();
        }
    }
}