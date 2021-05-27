using Infrastructure.FileSystem;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;

namespace Infrastructure.Logging
{
    public static class LoggerExtensions
    {
        private const string LoggingSectionName = "Logging";

        internal static IServiceCollection AddInfrastructureLogging(this IServiceCollection services, IConfiguration configuration)
        {
            var applicationName = configuration.GetApplicationName();
            var instanceName = configuration.GetValue<string>("WEBSITE_INSTANCE_ID");

            // Setting Setting Minimum Log Level from AppSettings
            var loggingSection = configuration.GetSection(LoggingSectionName);
            var useFileSystem = loggingSection.GetValue<bool?>("UseFileSystem") ?? true; //By default, FileSystemLogging is enabled...
            services.AddLogging(loggingBuilder =>
            {
                var logToConsole = loggingSection?.GetValue<bool?>("IncludeConsole") ?? true; //Log to console by default if fileSystem Loggin is disabled
                if (!useFileSystem && logToConsole)
                    loggingBuilder.AddConsole();

                var defaultLogLevel = loggingSection?.GetValue<LogLevel?>("LogLevel");
                if (defaultLogLevel != null)
                {
                    loggingBuilder.SetMinimumLevel(defaultLogLevel.Value);
                    loggingBuilder.AddFilter("", defaultLogLevel.Value, configuration);
                    return;
                }
                var children = loggingSection.GetSection("LogLevel").GetChildren();
                foreach (var childSection in children)
                {
                    if (Enum.TryParse<LogLevel>(childSection.Value, out var logLevel))
                    {
                        if (childSection.Key.Equals("Default", StringComparison.OrdinalIgnoreCase))
                            loggingBuilder.SetMinimumLevel(logLevel);
                        else
                            loggingBuilder.AddFilter(childSection.Key, logLevel, configuration);
                    }
                }
            });

            if (useFileSystem)
            {
                // Make sure Logger FileSystem is configured, so logger can be used to log errors during the application bootstrap
                services.AddFileSystems(configuration, new[] { "Logger" });

                // Registering LoggerProvider to handle File + Console + Debug Logging
                services.AddSingleton<ILoggerProvider, LoggerProvider>();
                services.Configure<LoggerOptions>(options =>
                {
                    var instanceInfo = string.IsNullOrEmpty(instanceName) ? "" : "_" + instanceName;
                    if (instanceInfo.Length > 8)
                        instanceInfo = instanceInfo.Substring(0, 8);

                    options.MainFileNamePattern = applicationName + instanceInfo + "_{0:yyyy-MM-dd}_{1:00}.log";
                    options.MaxSize = loggingSection?.GetValue<int?>("MaxSize") ?? 3 * 1024 * 1024; //3 MB DEFAULT
                    options.MilisecondsBetweenWrites = loggingSection?.GetValue<long?>("MilisecondsBetweenWrites") ?? 5000;
                    options.ShouldIncludeConsole = loggingSection?.GetValue<bool?>("IncludeConsole") ?? false;
                    options.ClearOnStartup = loggingSection?.GetValue<bool?>("ClearOnStartup") ?? false;
                });
            }

            return services;
        }

        private static void AddFilter(this ILoggingBuilder loggingBuilder, string key, LogLevel logLevel, IConfiguration configuration)
        {
            loggingBuilder.AddFilter(key, logLevel);
        }
    }
}