//using Microsoft.Extensions.Logging;
//using System.Collections.Generic;
//using System.IO;
//using System.Text;
//using System.Threading.Tasks;

//namespace Infrastructure.FileSystem
//{
//    internal class FileSystemFacade : IFileSystem
//    {
//        private readonly IFileSystem fileSystem;

//        public FileSystemFacade(IFileSystem fileSystem)
//        {
//            this.fileSystem = fileSystem;
//            Name = "FileSystemFacade";
//        }

//        public static ILogger Logger { get; set; }

//        public FileSystemConfiguration FileSystemConfiguration { get; }
//        public string Name { get; private set; }

//        public async Task<bool> ExistsAsync(string key)
//        {
//            using (var lb = Logger.CreateBlockTrace($"{fileSystem.Name}.{nameof(ExistsAsync)}({key})", BlockOutput.End))
//            {
//                var exists = await fileSystem.ExistsAsync(key);
//                lb.EndState = $"{exists}";
//                return exists;
//            }
//        }

//        public async Task<IList<string>> GetFilesAsync(string key)
//        {
//            using (var lb = Logger.CreateBlockTrace($"{fileSystem}.{nameof(GetFilesAsync)}({key})", BlockOutput.End))
//            {
//                var files = await fileSystem.GetFilesAsync(key);
//                lb.EndState = $"{files.Count}";
//                return files;
//            }
//        }

//        public async Task<FileInfo> GetFileInfoAsync(string key)
//        {
//            using (var lb = Logger.CreateBlockTrace($"{fileSystem}.{nameof(GetFileInfoAsync)}({key})", BlockOutput.End))
//            {
//                var fi = await fileSystem.GetFileInfoAsync(key);
//                lb.EndState = $"Size={fi?.Size} bytes, LastModified={fi?.LastModified.ToString()}";
//                return fi;
//            }
//        }

//        public async Task<string> DownloadTextAsync(string key, Encoding encoding)
//        {
//            using (var lb = Logger.CreateBlockTrace($"{fileSystem}.{nameof(DownloadTextAsync)}({key})", BlockOutput.End))
//            {
//                var text = await fileSystem.DownloadTextAsync(key, encoding);
//                lb.EndState = $"{text?.Length}";
//                return text;
//            }
//        }

//        public async Task<int> DownloadToStreamAsync(string key, Stream stream)
//        {
//            using (var lb = Logger.CreateBlockTrace($"{fileSystem}.{nameof(DownloadToStreamAsync)}({key})", BlockOutput.End))
//            {
//                var code = await fileSystem.DownloadToStreamAsync(key, stream);
//                lb.EndState = $"{code} - {stream.Length} bytes";
//                return code;
//            }
//        }

//        public async Task<byte[]> DownloadToBytesAsync(string key)
//        {
//            using (var lb = Logger.CreateBlockTrace($"{nameof(FileSystemDisk)}.{nameof(DownloadToBytesAsync)}({key})", BlockOutput.End))
//            {
//                var bytes = await fileSystem.DownloadToBytesAsync(key);
//                return bytes;
//            }
//        }

//        public async Task UploadTextAsync(string key, string content, Encoding encoding)
//        {
//            using (Logger.CreateBlockTrace($"{fileSystem}.{nameof(UploadTextAsync)}({key}) --> {content?.Length}", BlockOutput.End))
//            {
//                await fileSystem.UploadTextAsync(key, content, encoding);
//            }
//        }

//        public async Task UploadAsync(string key, Stream stream, string contentType)
//        {
//            using (Logger.CreateBlockTrace($"{fileSystem}.{nameof(UploadAsync)}({key}) --> {stream?.Length}", BlockOutput.End))
//            {
//                await fileSystem.UploadAsync(key, stream);
//            }
//        }

//        public async Task UploadAsync(string key, byte[] bytes, string contentType = null)
//        {
//            using (var lb = Logger.CreateBlockTrace($"{nameof(FileSystemDisk)}.{nameof(UploadAsync)}({key}) --> {bytes?.Length}", BlockOutput.End))
//            {
//                await fileSystem.UploadAsync(key, bytes, contentType);
//            }
//        }

//        public async Task AppendTextAsync(string key, string content, Encoding encoding)
//        {
//            using (Logger.CreateBlockTrace($"{fileSystem}.{nameof(AppendTextAsync)}({key}) --> {content?.Length}", BlockOutput.End))
//            {
//                await fileSystem.AppendTextAsync(key, content, encoding);
//            }
//        }

//        public async Task AppendAsync(string key, Stream stream)
//        {
//            using (Logger.CreateBlockTrace($"{fileSystem}.{nameof(AppendTextAsync)}({key}) --> {stream?.Length}", BlockOutput.End))
//            {
//                await fileSystem.AppendAsync(key, stream);
//            }
//        }

//        public async Task DeleteAsync(string key)
//        {
//            using (Logger.CreateBlockTrace($"{fileSystem}.{nameof(DeleteAsync)}({key})", BlockOutput.End))
//            {
//                await fileSystem.DeleteAsync(key);
//            }
//        }

//        public async Task SetContentTypeAsync(string fileName, string contentType)
//        {
//            await Task.CompletedTask;
//        }
//    }
//}