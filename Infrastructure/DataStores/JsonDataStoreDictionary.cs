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
    //TODO Add Lock mecanism

    public class JsonDataStoreDictionary<TKey, TValue>
    {
        private readonly ILogger logger;
        private readonly bool writeObjectType;
        private readonly bool autoBackupEnabled;

        public JsonDataStoreDictionary(ILogger logger, bool writeObjectType = false, bool autoBackupEnabled = true)
        {
            this.logger = logger;
            this.writeObjectType = writeObjectType;
            this.autoBackupEnabled = autoBackupEnabled;
        }

        public async Task<TValue> GetAsync(IFileSystem fileSystem, string filename, TKey key)
        {
            using (logger.CreateBlockTrace($"{nameof(JsonDataStoreDictionary<TKey, TValue>)}.{nameof(GetAsync)}(FileSystem={fileSystem.Name}, Filename={filename}, Key={key})"))
            {
                var data = await LoadDataAsync(fileSystem, filename);
                if (data.TryGetValue(key, out var value))
                    return value;

                return default(TValue);
            }
        }

        public async Task<IDictionary<TKey, TValue>> GetAllAsync(IFileSystem fileSystem, string filename)
        {
            using (logger.CreateBlockTrace($"{nameof(JsonDataStoreDictionary<TKey, TValue>)}.{nameof(GetAllAsync)}(FileSystem={fileSystem.Name}, Filename={filename})"))
            {
                return await LoadDataAsync(fileSystem, filename);
            }
        }

        public async Task<IEnumerable<TValue>> FindAsync(IFileSystem fileSystem, string filename, Func<TValue, bool> predicate)
        {
            if (predicate == null)
                throw new ArgumentNullException(nameof(predicate));

            using (logger.CreateBlockTrace($"{nameof(JsonDataStoreDictionary<TKey, TValue>)}.{nameof(FindAsync)}(FileSystem={fileSystem.Name}, Filename={filename}, Predicate={predicate.ToString()})"))
            {
                var dict = await LoadDataAsync(fileSystem, filename);

                if (predicate != null)
                    return dict.Values.Where(predicate);

                return dict.Values;
            }
        }

        public async Task<TValue> FindFirstAsync(IFileSystem fileSystem, string filename, Func<TValue, bool> predicate)
        {
            if (predicate == null)
                throw new ArgumentNullException(nameof(predicate));

            using (logger.CreateBlockTrace($"{nameof(JsonDataStoreDictionary<TKey, TValue>)}.{nameof(FindFirstAsync)}(FileSystem={fileSystem.Name}, Filename={filename}, Predicate={predicate})"))
            {
                var dict = await LoadDataAsync(fileSystem, filename);

                if (predicate != null)
                    return dict.Values.Where(predicate).FirstOrDefault();

                return dict.Values.FirstOrDefault();
            }
        }

        public async Task InsertAsync(IFileSystem fileSystem, string filename, TKey key, TValue value)
        {
            using (logger.CreateBlockTrace($"{nameof(JsonDataStoreDictionary<TKey, TValue>)}.{nameof(InsertAsync)}(FileSystem={fileSystem.Name}, Filename={filename})"))
            {
                var dict = await LoadDataAsync(fileSystem, filename);
                if (dict.ContainsKey(key))
                    throw new ValidationException($"Key '{key.ToString()}' already exists");
                dict.Add(key, value);

                await SaveAsync(fileSystem, filename, dict);
            }
        }

        public async Task UpdateAsync(IFileSystem fileSystem, string filename, TKey key, TValue value)
        {
            using (logger.CreateBlockTrace($"{nameof(JsonDataStoreDictionary<TKey, TValue>)}.{nameof(UpdateAsync)}(FileSystem={fileSystem.Name}, Filename={filename})"))
            {
                var dict = await LoadDataAsync(fileSystem, filename);
                if (!dict.ContainsKey(key))
                    throw new ValidationException($"Key '{key.ToString()}' doesn't exists");
                dict[key] = value;

                await SaveAsync(fileSystem, filename, dict);
            }
        }

        public async Task InsertOrUpdateAsync(IFileSystem fileSystem, string filename, IEnumerable<TValue> value, Func<TValue, TKey> predicate)
        {
            using (logger.CreateBlockTrace($"{nameof(JsonDataStoreDictionary<TKey, TValue>)}.{nameof(UpdateAsync)}(FileSystem={fileSystem.Name}, Filename={filename})"))
            {
                var dict = await LoadDataAsync(fileSystem, filename);
                foreach (var v in value)
                {
                    var key = predicate(v);
                    if (dict.ContainsKey(key))
                        dict[key] = v;
                    else
                        dict.Add(key, v);
                }

                await SaveAsync(fileSystem, filename, dict);
            }
        }

        public async Task DeleteAsync(IFileSystem fileSystem, string filename, TKey key)
        {
            using (logger.CreateBlockTrace($"{nameof(JsonDataStoreDictionary<TKey, TValue>)}.{nameof(DeleteAsync)}(FileSystem={fileSystem.Name}, Filename={filename})"))
            {
                var dict = await LoadDataAsync(fileSystem, filename);
                dict.Remove(key);
                await SaveAsync(fileSystem, filename, dict);
            }
        }

        public async Task DeleteAllAsync(IFileSystem fileSystem, string filename)
        {
            using (logger.CreateBlockTrace($"{nameof(JsonDataStoreDictionary<TKey, TValue>)}.{nameof(DeleteAllAsync)}(FileSystem={fileSystem.Name}, Filename={filename})"))
            {
                await SaveAsync(fileSystem, filename, new Dictionary<TKey, TValue>());
            }
        }

        private async Task<IDictionary<TKey, TValue>> LoadDataAsync(IFileSystem fileSystem, string filename)
        {
            if (fileSystem == null)
                throw new ArgumentNullException(nameof(fileSystem));
            if (string.IsNullOrWhiteSpace(filename))
                throw new ArgumentNullException(nameof(filename));

            using (logger.CreateBlockTrace($"{nameof(JsonDataStoreDictionary<TKey, TValue>)}.{nameof(LoadDataAsync)} (FileSystem={fileSystem.Name}, Filename={filename})", BlockOutput.End))
            {
                return await fileSystem.ReadObjectAsync<Dictionary<TKey, TValue>>(filename);
            }
        }

        private async Task SaveAsync(IFileSystem fileSystem, string filename, IDictionary<TKey, TValue> dict)
        {
            if (fileSystem == null)
                throw new ArgumentNullException(nameof(fileSystem));
            if (string.IsNullOrWhiteSpace(filename))
                throw new ArgumentNullException(nameof(filename));
            if (dict == null)
                throw new ArgumentNullException(nameof(dict));

            using (logger.CreateBlockTrace($"{nameof(JsonDataStoreDictionary<TKey, TValue>)}.{nameof(SaveAsync)} (FileSystem={fileSystem.Name}, Filename={filename}, List={dict.Count()} elements)", BlockOutput.End))
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

                await fileSystem.WriteObjectAsync(filename, dict, writeObjectType);
            }
        }
    }
}