using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.FileSystem
{
    public class FileSystemAzure : IFileSystem
    {
        private AzureBlobStorage azureBlobStorage;

        public FileSystemAzure(FileSystemConfiguration fileSystemConfiguration)
        {
            FileSystemConfiguration = fileSystemConfiguration;
            Name = fileSystemConfiguration.Name;

            var containerName = fileSystemConfiguration.GetPropertyString("ContainerName", null);
            if (containerName == null)
                throw new Exception($"The ContainerName Property was not supplied for the '{fileSystemConfiguration.Name}' filesystem");

            azureBlobStorage = AzureBlobStorage.CreateAsync(fileSystemConfiguration.Value, containerName).Result;
        }

        public FileSystemConfiguration FileSystemConfiguration { get; }
        public string Name { get; private set; }

        public async Task<bool> ExistsAsync(string key)
        {
            var exists = await azureBlobStorage.ExistsAsync(key);
            return exists;
        }

        public async Task<IList<string>> GetFilesAsync(string path)
        {
            var files = (await azureBlobStorage.GetBlobsAsync(path, true)).ToList();

            var names = new List<string>();
            foreach (var file in files)
                names.Add(file.Uri.ToString());
            return names;
        }

        public async Task<FileInfo> GetFileInfoAsync(string key)
        {
            try
            {
                var blob = azureBlobStorage.GetBlob(key);
                await blob.FetchAttributesAsync();

                var fileInfo = new FileInfo
                {
                    Size = blob.Properties.Length,
                    LastModified = blob.Properties.LastModified.HasValue ? blob.Properties.LastModified.Value.UtcDateTime : DateTime.MinValue,
                    Created = blob.Properties.Created.HasValue ? blob.Properties.Created.Value.UtcDateTime : DateTime.MinValue
                };

                return fileInfo;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<string> DownloadTextAsync(string key, Encoding encoding)
        {
            var text = await azureBlobStorage.DownloadTextAsync(key, encoding);
            if (!string.IsNullOrEmpty(text))
            {
                var startIndex = 0;
                while (char.GetUnicodeCategory(text, startIndex) == UnicodeCategory.Format)
                    startIndex++;
                text = text.Substring(startIndex, text.Length - startIndex);
            }

            return text;
        }

        public async Task<int> DownloadToStreamAsync(string key, Stream stream)
        {
            var code = await azureBlobStorage.DownloadToStreamAsync(key, stream);
            return code;
        }

        public async Task<byte[]> DownloadToBytesAsync(string key)
        {
            return await azureBlobStorage.DownloadBytesAsync(key);
        }

        public async Task UploadTextAsync(string key, string content, Encoding encoding)
        {
            await azureBlobStorage.UploadTextAsync(key, content, encoding);
        }

        public async Task UploadAsync(string key, Stream stream, string contentType)
        {
            await azureBlobStorage.UploadStreamAsync(key, stream, 0, contentType);
        }

        public async Task UploadAsync(string key, byte[] bytes, string contentType = null)
        {
            await azureBlobStorage.UploadBytesAsync(key, bytes, contentType);
        }

        public async Task AppendTextAsync(string key, string content, Encoding encoding)
        {
            await azureBlobStorage.AppendTextAsync(key, content);
        }

        public Task AppendAsync(string fileName, Stream stream)
        {
            throw new NotImplementedException($"{nameof(FileSystemAzure)}.{nameof(AppendAsync)}()");
        }

        public async Task DeleteAsync(string key)
        {
            await azureBlobStorage.DeleteAsync(key);
        }

        public async Task SetContentTypeAsync(string fileName, string contentType)
        {
            await azureBlobStorage.SetContentTypeAsync(fileName, contentType);
        }
    }
}