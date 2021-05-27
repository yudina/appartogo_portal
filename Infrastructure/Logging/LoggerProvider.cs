using Infrastructure.FileSystem;
using Infrastructure.Scheduling;
using Infrastructure.Storage;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;

namespace Infrastructure.Logging
{
    [DebuggerStepThrough]
    public class LoggerProvider : ILoggerProvider
    {
        private const double logLifeDurationInMinutes = 10;

        private static readonly Dictionary<LogLevel, ConcurrentQueue<DateTime>> logLevelCounters = new Dictionary<LogLevel, ConcurrentQueue<DateTime>> {
            { LogLevel.Critical, new ConcurrentQueue<DateTime> () },
            { LogLevel.Error, new ConcurrentQueue<DateTime> () },
            { LogLevel.Warning, new ConcurrentQueue<DateTime> () }
        };

        private readonly LoggerOptions loggerOptions;

        public LoggerProvider(IFileSystemFactory fileSystemFactory, IScheduler scheduler, IOptions<LoggerOptions> options)
        {
            loggerOptions = options.Value;
            var fileSystem = fileSystemFactory.Get("Logger");
            MainBufferedFile = new BufferedFile(scheduler, fileSystem, loggerOptions.MainFileNamePattern, loggerOptions.MaxSize, loggerOptions.MilisecondsBetweenWrites, loggerOptions.ClearOnStartup);
        }

        public BufferedFile MainBufferedFile { get; }
        public bool WriteToConsole => loggerOptions.ShouldIncludeConsole;

        public static int GetLogCount(LogLevel level)
        {
            LogCounterCleanup(level);

            if (logLevelCounters.TryGetValue(level, out var queue))
                return queue.Count;
            return 0;
        }

        public void AddLogCount(LogLevel level)
        {
            if (logLevelCounters.TryGetValue(level, out var queue))
                queue.Enqueue(DateTime.UtcNow);
        }

        public ILogger CreateLogger(string categoryName)
        {
            return new Logger(this, categoryName);
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
                MainBufferedFile?.FlushAsync().Wait();
        }

        private static void LogCounterCleanup(LogLevel level)
        {
            if (logLevelCounters.TryGetValue(level, out var queue))
            {
                while (queue.Count > 0)
                {
                    if (queue.TryPeek(out var datetime) && DateTime.UtcNow.Subtract(datetime).TotalMinutes > logLifeDurationInMinutes)
                        queue.TryDequeue(out datetime);
                    else
                        break;
                }
            }
        }
    }
}