using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.FileSystem
{
    public static class FileSystemExtensions
    {
        private const string FileSystemsSectionName = "FileSystems";

        public static async Task WriteObjectAsync<T>(this IFileSystem fileSystem, string fileName, T obj, bool writeObjectType = false)
        {
            var settings = new JsonSerializerSettings()
            {
                DateTimeZoneHandling = DateTimeZoneHandling.Utc,
                Converters = new List<JsonConverter> { new Newtonsoft.Json.Converters.StringEnumConverter() },
                DefaultValueHandling = DefaultValueHandling.Ignore,
                NullValueHandling = NullValueHandling.Ignore,
                Formatting = Formatting.Indented
            };
            if (writeObjectType)
                settings.TypeNameHandling = TypeNameHandling.Objects;

            var json = JsonConvert.SerializeObject(obj, settings);

            await fileSystem.UploadTextAsync(fileName, json, Encoding.UTF8);
        }

        public static async Task<T> ReadObjectAsync<T>(this IFileSystem fileSystem, string fileName) where T : new()
        {
            var json = await ReadTextAsync(fileSystem, fileName);
            if (string.IsNullOrWhiteSpace(json))
                return new T();

            return JsonConvert.DeserializeObject<T>(json);
        }

        public static async Task<string> ReadTextAsync(this IFileSystem fileSystem, string fileName)
        {
            var text = await fileSystem.DownloadTextAsync(fileName, Encoding.UTF8);
            return text ?? string.Empty;
        }

        internal static IServiceCollection AddFileSystems(this IServiceCollection services, IConfiguration configuration, string[] requiredNames)
        {
            if (requiredNames == null || requiredNames.Length == 0 || requiredNames.Any(string.IsNullOrEmpty))
                return services;

            //Load configuration section
            var fileSystemConfigurations = new Dictionary<string, FileSystemConfiguration>();
            configuration.GetSection(FileSystemsSectionName).Bind(fileSystemConfigurations);

            //Validate required
            var missingConfigurations = requiredNames.Except(fileSystemConfigurations.Select(d => d.Key)).ToArray();
            if (missingConfigurations.Any())
                throw new Exception($"Missing FileSystem Configuration(s): {string.Join(", ", missingConfigurations)}");

            services.TryAddSingleton<IFileSystemFactory, FileSystemFactory>();
            services.Configure<FileSystemFactoryOptions>(options =>
            {
                // It is important to add to dictionary instead of replacing it, because it is called twice (AddLogger + AddFileSystems)
                foreach (var keyValuePair in fileSystemConfigurations.Where(x => requiredNames.Contains(x.Key) && !options.FileSystemConfigurations.ContainsKey(x.Key)))
                {
                    keyValuePair.Value.Name = keyValuePair.Key;
                    options.FileSystemConfigurations.Add(keyValuePair.Key, keyValuePair.Value);
                }
            });

            return services;
        }

        internal static IServiceCollection WarnFileSystemsConfigurationNotDeclared(this IServiceCollection services, IConfiguration configuration)
        {
            // Check for declared filesystems in appsettings
            using (var serviceProvider = services.BuildServiceProvider())
            {
                //Load Defined(Required)
                var options = serviceProvider.GetRequiredService<IOptions<FileSystemFactoryOptions>>();

                //Load Configured(AppSettings)
                var fileSystemConfigurations = new Dictionary<string, FileSystemConfiguration>();
                configuration.GetSection(FileSystemsSectionName).Bind(fileSystemConfigurations);

                var list = fileSystemConfigurations.Where(x => !options.Value.FileSystemConfigurations.ContainsKey(x.Key)).ToList();
                if (!list.Any())
                {
                    return services;
                }

                var unused = string.Join(", ", list.Select(x => x.Key));
                var logger = serviceProvider.GetRequiredService<ILoggerFactory>().CreateLogger(typeof(FileSystemExtensions).FullName);
                logger.LogWarning($"FileSystem(s) '{unused}' are defined in configuration file, but not declared in BootstrapInfrastructure.  {typeof(FileSystemFactory).Name} will not let you use them.");
            }

            return services;
        }
    }
}