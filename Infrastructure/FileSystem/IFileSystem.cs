using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.FileSystem
{
    public interface IFileSystem
    {
        FileSystemConfiguration FileSystemConfiguration { get; }
        string Name { get; }

        Task<bool> ExistsAsync(string key);

        Task<FileInfo> GetFileInfoAsync(string fileName);

        Task<IList<string>> GetFilesAsync(string path);

        Task<string> DownloadTextAsync(string key, Encoding encoding);

        Task<int> DownloadToStreamAsync(string key, Stream stream);

        Task<byte[]> DownloadToBytesAsync(string key);

        Task UploadTextAsync(string key, string content, Encoding encoding);

        Task UploadAsync(string fileName, Stream stream, string contentType = null);

        Task UploadAsync(string fileName, byte[] bytes, string contentType = null);

        Task AppendTextAsync(string key, string content, Encoding encoding);

        Task AppendAsync(string fileName, Stream stream);

        Task DeleteAsync(string fileName);

        Task SetContentTypeAsync(string fileName, string contentType);
    }
}