using Infrastructure.FileSystem;
using Infrastructure.Scheduling;
using System;
using System.Diagnostics;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Infrastructure.Storage
{
    public class BufferedFile : IDisposable
    {
        private readonly StringBuilder buffer = new StringBuilder();
        private readonly string fileNamePattern;
        private readonly IFileSystem fileSystem;
        private readonly int maxSize;

        private readonly SemaphoreSlim semaphoreSlim = new SemaphoreSlim(1);
        private int currentTotalSize;
        private DateTime lastWrite;

        public BufferedFile(IScheduler scheduler, IFileSystem fileSystem, string fileNamePattern, int maxSize, long milisecondsBetweenWrites, bool clearFile)
        {
            this.fileSystem = fileSystem;
            this.fileNamePattern = fileNamePattern;
            this.maxSize = maxSize;

            lastWrite = DateTime.MinValue;

            if (clearFile)
                ClearFileAsync().Wait();

            scheduler.AddTask(TimeSpan.FromMilliseconds(milisecondsBetweenWrites), async () => { await FlushAsync(); });
        }

        private async Task ClearFileAsync()
        {
            await NextFileNameAsync();
            if (await fileSystem.ExistsAsync(CurrentFileName))
                await fileSystem.DeleteAsync(CurrentFileName);
        }

        public string CurrentFileName { get; private set; }

        public async Task AppendAsync(string message)
        {
            await semaphoreSlim.WaitAsync();
            try
            {
                buffer.Append(message);
            }
            finally
            {
                semaphoreSlim.Release();
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public async Task FlushAsync()
        {
            if (buffer.Length == 0)
                return;

            if (DateTime.UtcNow.Date != lastWrite.Date || (maxSize > 0 && currentTotalSize > maxSize))
            {
                await semaphoreSlim.WaitAsync();
                try
                {
                    //Ensure that the filename was not obtained since the lock
                    if (DateTime.UtcNow.Date != lastWrite.Date || (maxSize > 0 && currentTotalSize > maxSize))
                        await NextFileNameAsync();
                }
                finally
                {
                    semaphoreSlim.Release();
                }
            }

            string bufferValue;
            await semaphoreSlim.WaitAsync();
            try
            {
                //Ensure that the buffer was not flushed since the lock was obtained
                if (buffer.Length == 0)
                    return;

                currentTotalSize += buffer.Length;

                bufferValue = buffer.ToString();
                buffer.Length = 0; // Clear buffer

                lastWrite = DateTime.UtcNow;
            }
            finally
            {
                semaphoreSlim.Release();
            }

            Exception exception = null;
            var nb = 0;
            while (nb < 2)
            {
                try
                {
                    await fileSystem.AppendTextAsync(CurrentFileName, bufferValue, Encoding.UTF8);
                    break;
                }
                catch (Exception e)
                {
                    exception = e;
                    ++nb;
                }
            }

            if (exception != null)
                Console.WriteLine($"BufferedFile: Exception occured writing to file {CurrentFileName} : {exception.Message}");
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
                semaphoreSlim.Dispose();
        }

        private async Task NextFileNameAsync()
        {
            var lastNumber = 1;
            while (true)
            {
                var fileName = string.Format(fileNamePattern, DateTime.UtcNow, lastNumber).ToLower();
                var fileInfo = await fileSystem.GetFileInfoAsync(fileName);

                var size = fileInfo?.Size ?? 0;
                if (fileInfo == null || size < maxSize)
                {
                    CurrentFileName = fileName;
                    currentTotalSize = (int)size;
                    Debug.WriteLine("BufferedFile.NextFileName: New fileName " + CurrentFileName);
                    return;
                }

                ++lastNumber;
            }
        }
    }
}