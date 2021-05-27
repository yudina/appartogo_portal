using Infrastructure.Exceptions;
using Infrastructure.FileSystem;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.DataStores
{
    //TODO Add locking mecanism

    public class JsonDataStore<T>
    {
        private readonly ILogger logger;
        private readonly bool writeObjectType;
        private readonly bool autoBackupEnabled;

        public JsonDataStore(ILogger logger, bool writeObjectType = false, bool autoBackupEnabled = true)
        {
            this.logger = logger;
            this.writeObjectType = writeObjectType;
            this.autoBackupEnabled = autoBackupEnabled;
        }

        public async Task<List<T>> GetAllAsync(IFileSystem fileSystem, string filename)
        {
            using (logger.CreateBlockTrace($"{nameof(JsonDataStore<T>)}.{nameof(GetAllAsync)}(FileSystem={fileSystem.Name}, Filename={filename})"))
            {
                return await LoadDataAsync(fileSystem, filename);
            }
        }

        public async Task<IEnumerable<T>> FindAsync(IFileSystem fileSystem, string filename, Func<T, bool> predicate)
        {
            if (predicate == null)
                throw new ArgumentNullException(nameof(predicate));

            using (logger.CreateBlockTrace($"{nameof(JsonDataStore<T>)}.{nameof(FindAsync)}(FileSystem={fileSystem.Name}, Filename={filename}, Predicate={predicate.ToString()})"))
            {
                var list = await LoadDataAsync(fileSystem, filename);
                if (predicate == null)
                    return list;

                return list.Where(predicate);
            }
        }

        public async Task<T> FindFirstAsync(IFileSystem fileSystem, string filename, Func<T, bool> predicate)
        {
            if (predicate == null)
                throw new ArgumentNullException(nameof(predicate));

            using (logger.CreateBlockTrace($"{nameof(JsonDataStore<T>)}.{nameof(FindFirstAsync)}(FileSystem={fileSystem.Name}, Filename={filename}, Predicate={predicate})"))
            {
                var list = await LoadDataAsync(fileSystem, filename);

                if (predicate != null)
                    return list.FirstOrDefault(predicate);

                return list.FirstOrDefault();
            }
        }

        public async Task InsertAsync(IFileSystem fileSystem, string filename, T entity)
        {
            if (fileSystem == null)
                throw new ArgumentNullException(nameof(fileSystem));
            if (string.IsNullOrWhiteSpace(filename))
                throw new ArgumentNullException(nameof(filename));
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));

            using (logger.CreateBlockTrace($"{nameof(JsonDataStore<T>)}.{nameof(InsertAsync)}(FileSystem={fileSystem.Name}, Filename={filename}, Entity={entity})"))
            {
                var list = await LoadDataAsync(fileSystem, filename);
                list.Add(entity);

                await SaveAsync(fileSystem, filename, list);
            }
        }

        public async Task InsertOrUpdateAsync(IFileSystem fileSystem, string filename, T entity, Predicate<T> predicate)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));

            using (logger.CreateBlockTrace($"{nameof(JsonDataStore<T>)}.{nameof(UpdateAsync)}(FileSystem={fileSystem.Name}, Filename={filename}, Entity={entity})"))
            {
                var list = await LoadDataAsync(fileSystem, filename);

                var index = list.FindIndex(predicate);
                if (index < 0)
                    list.Add(entity);
                else
                    list[index] = entity;

                await SaveAsync(fileSystem, filename, list);
            }
        }

        public async Task UpdateAsync(IFileSystem fileSystem, string filename, T entity, Predicate<T> predicate)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));

            using (logger.CreateBlockTrace($"{nameof(JsonDataStore<T>)}.{nameof(UpdateAsync)}(FileSystem={fileSystem.Name}, Filename={filename}, Entity={entity})"))
            {
                var list = await LoadDataAsync(fileSystem, filename);

                var index = list.FindIndex(predicate);
                if (index < 0)
                    throw new NotFoundException($"{typeof(T).Name} not found [Entity={entity}]");

                list[index] = entity;

                await SaveAsync(fileSystem, filename, list);
            }
        }

        public async Task DeleteAsync(IFileSystem fileSystem, string filename, Predicate<T> predicate)
        {
            if (predicate == null)
                throw new ArgumentNullException(nameof(predicate));

            using (logger.CreateBlockTrace($"{nameof(JsonDataStore<T>)}.{nameof(DeleteAsync)}(FileSystem={fileSystem.Name}, Filename={filename})"))
            {
                var list = await LoadDataAsync(fileSystem, filename);

                var index = list.FindIndex(predicate);
                list.Remove(list[index]);

                await SaveAsync(fileSystem, filename, list);
            }
        }

        public async Task DeleteAllAsync(IFileSystem fileSystem, string filename)
        {
            using (logger.CreateBlockTrace($"{nameof(JsonDataStore<T>)}.{nameof(DeleteAllAsync)} (FileSystem={fileSystem.Name}, Filename={filename})"))
            {
                await SaveAsync(fileSystem, filename, new List<T>());
            }
        }

        private async Task<List<T>> LoadDataAsync(IFileSystem fileSystem, string filename)
        {
            if (fileSystem == null)
                throw new ArgumentNullException(nameof(fileSystem));
            if (string.IsNullOrWhiteSpace(filename))
                throw new ArgumentNullException(nameof(filename));

            using (var bt = logger.CreateBlockTrace($"{nameof(JsonDataStore<T>)}.{nameof(LoadDataAsync)} (FileSystem={fileSystem.Name}, Filename={filename})", BlockOutput.End))
            {
                return await fileSystem.ReadObjectAsync<List<T>>(filename);
            }
        }

        private async Task SaveAsync(IFileSystem fileSystem, string filename, IEnumerable<T> list)
        {
            if (fileSystem == null)
                throw new ArgumentNullException(nameof(fileSystem));
            if (string.IsNullOrWhiteSpace(filename))
                throw new ArgumentNullException(nameof(filename));
            if (list == null)
                throw new ArgumentNullException(nameof(list));

            using (logger.CreateBlockTrace($"{nameof(JsonDataStore<T>)}.{nameof(SaveAsync)} (FileSystem={fileSystem.Name}, Filename={filename}, List={list.Count()} elements)", BlockOutput.End))
            {
                if (autoBackupEnabled)
                {
                    var backupFilename = $"{filename}-{DateTime.UtcNow:yyyyMMdd-HH}.json";
                    if (!await fileSystem.ExistsAsync(backupFilename))
                    {
                        var data = await fileSystem.DownloadTextAsync(filename, Encoding.UTF8);
                        await fileSystem.UploadTextAsync(backupFilename, data, Encoding.UTF8);
                    }
                }

                await fileSystem.WriteObjectAsync(filename, list, writeObjectType);
            }
        }
    }
}