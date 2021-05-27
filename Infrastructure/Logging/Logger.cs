using Infrastructure.Extensions;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;

namespace Infrastructure.Logging
{
    [DebuggerStepThrough]
    internal class Logger : ILogger
    {
        private readonly string categoryName;
        private readonly LoggerProvider provider;

        private Dictionary<LogLevel, string> logLevelDescriptions = new Dictionary<LogLevel, string> {
            { LogLevel.Critical, "CRI" },
            { LogLevel.Error, "ERR" },
            { LogLevel.Warning, "WRN" },
            { LogLevel.Information, "INF" },
            { LogLevel.Trace, "TRC" },
            { LogLevel.Debug, "DBG" },
        };

        public Logger(LoggerProvider provider, string categoryName)
        {
            this.categoryName = categoryName;
            this.provider = provider;
        }

        public IDisposable BeginScope<TState>(TState state)
        {
            return null;
        }

        public bool IsEnabled(LogLevel logLevel)
        {
            return logLevel < LogLevel.None;
        }

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter)
        {
            if (!IsEnabled(logLevel))
                return;

            provider.AddLogCount(logLevel);

            var builder = new StringBuilder();
            builder.Append($"{DateTimeUtils.NowToEst().ToString("yyyy-MM-dd HH:mm:ss.fff")} {logLevelDescriptions[logLevel]} [{categoryName}] ");
            builder.AppendLine(formatter(state, exception));

            if (exception != null)
                builder.AppendLine(exception.ToString());

            //Write to sinks
            Debug.Write(builder.ToString());

            if (provider.WriteToConsole)
            {
                switch (logLevel)
                {
                    case LogLevel.Trace:
                        Console.ForegroundColor = ConsoleColor.DarkGray;
                        break;

                    case LogLevel.Debug:
                        Console.ForegroundColor = ConsoleColor.White;
                        break;

                    case LogLevel.Information:
                        Console.ForegroundColor = ConsoleColor.Cyan;
                        break;

                    case LogLevel.Warning:
                        Console.ForegroundColor = ConsoleColor.DarkYellow;
                        break;

                    case LogLevel.Error:
                        Console.ForegroundColor = ConsoleColor.Red;
                        break;

                    case LogLevel.Critical:
                        Console.ForegroundColor = ConsoleColor.DarkRed;
                        break;

                    case LogLevel.None:
                    default:
                        Console.ForegroundColor = ConsoleColor.White;
                        break;
                }

                Console.Write(builder.ToString());
                Console.ForegroundColor = ConsoleColor.White;
            }

            provider.MainBufferedFile.AppendAsync(builder.ToString()).Wait();
        }
    }
}