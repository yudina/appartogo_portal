using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.FileSystem
{
    public class FileSystemDisk : IFileSystem
    {
        private readonly DirectoryInfo directory;
        private readonly bool createDirectory;
        private readonly string containerName;

        public FileSystemDisk(FileSystemConfiguration fileSystemConfiguration)
        {
            FileSystemConfiguration = fileSystemConfiguration;
            Name = fileSystemConfiguration.Name;

            createDirectory = fileSystemConfiguration.GetPropertyBool("CreateDirectories", false);
            containerName = fileSystemConfiguration.GetPropertyString("ContainerName", string.Empty);

            var path = Path.Combine(fileSystemConfiguration.Value, containerName ?? string.Empty);
            directory = createDirectory ? Directory.CreateDirectory(path) : new DirectoryInfo(path);
        }

        public FileSystemConfiguration FileSystemConfiguration { get; }
        public string Name { get; private set; }

        public async Task<bool> ExistsAsync(string key)
        {
            var exists = File.Exists(GetName(key));
            await Task.CompletedTask;
            return exists;
        }

        public async Task<IList<string>> GetFilesAsync(string path)
        {
            var files = Directory.GetFiles(GetName(path));
            await Task.CompletedTask;
            return files;
        }

        public async Task<FileInfo> GetFileInfoAsync(string key)
        {
            try
            {
                var fileName = Path.Combine(directory.FullName, key);
                if (!File.Exists(fileName))
                    return null;

                var fi = new System.IO.FileInfo(fileName);

                var fileInfo = new FileInfo
                {
                    Size = fi.Length,
                    LastModified = fi.LastWriteTimeUtc,
                    Created = fi.CreationTime
                };

                await Task.CompletedTask;
                return fileInfo;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<string> DownloadTextAsync(string key, Encoding encoding)
        {
            try
            {
                using (var fs = new FileStream(GetName(key), FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
                using (var sr = new StreamReader(fs, encoding))
                {
                    return await sr.ReadToEndAsync();
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<int> DownloadToStreamAsync(string key, Stream stream)
        {
            var name = GetName(key);
            try
            {
                var fs = new FileStream(name, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
                using (var reader = new StreamReader(fs, Encoding.UTF8))
                {
                    await fs.CopyToAsync(stream);
                    return 200;
                }
            }
            catch (Exception)
            {
                var code = File.Exists(name) ? 500 : 404;
                return code;
            }
        }

        public async Task<byte[]> DownloadToBytesAsync(string key)
        {
            var fileName = GetName(key);
            return await File.ReadAllBytesAsync(fileName);
        }

        public async Task UploadTextAsync(string key, string content, Encoding encoding)
        {
            var fileName = GetName(key);
            CreateDirectory(fileName);
            await File.WriteAllTextAsync(fileName, content, encoding);
        }

        public async Task UploadAsync(string key, Stream stream, string contentType)
        {
            var fileName = GetName(key);
            CreateDirectory(fileName);

            const int BufferSize = 4096;
            using (var outputStream = new FileStream(fileName, FileMode.Create, FileAccess.Write, FileShare.Read, BufferSize, true))
            {
                var bytes = new byte[stream.Length];
                stream.Seek(0, SeekOrigin.Begin);
                var actualCount = await stream.ReadAsync(bytes, 0, bytes.Length);
                await outputStream.WriteAsync(bytes, 0, actualCount);
            }
        }

        public async Task UploadAsync(string key, byte[] bytes, string contentType = null)
        {
            var fileName = GetName(key);
            CreateDirectory(fileName);

            await File.WriteAllBytesAsync(fileName, bytes);
        }

        public async Task AppendTextAsync(string key, string content, Encoding encoding)
        {
            var fileName = GetName(key);
            CreateDirectory(fileName);
            await File.AppendAllTextAsync(fileName, content, encoding);
        }

        public async Task AppendAsync(string key, Stream stream)
        {
            var fileName = GetName(key);
            CreateDirectory(fileName);

            const int BufferSize = 4096;
            using (var outputStream = new FileStream(fileName, FileMode.Append, FileAccess.Write, FileShare.Read, BufferSize, true))
            {
                var bytes = new byte[stream.Length];
                stream.Seek(0, SeekOrigin.Begin);
                var actualCount = await stream.ReadAsync(bytes, 0, bytes.Length);
                await outputStream.WriteAsync(bytes, 0, actualCount);
            }
        }

        public async Task DeleteAsync(string key)
        {
            var fileName = GetName(key);
            File.Delete(fileName);
            await Task.CompletedTask;
        }

        public async Task SetContentTypeAsync(string fileName, string contentType)
        {
            await Task.CompletedTask;
        }

        private void CreateDirectory(string fileName)
        {
            if (!createDirectory)
                return;

            var directory = Path.GetDirectoryName(fileName);
            if (!Directory.Exists(directory))
                Directory.CreateDirectory(directory);
        }

        private string GetName(string key)
        {
            return Path.Combine(directory.FullName, key);
        }
    }
}