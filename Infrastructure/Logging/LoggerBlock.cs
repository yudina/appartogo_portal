using System;
using System.Diagnostics;

namespace Microsoft.Extensions.Logging
{
    public enum BlockOutput
    {
        End,
        StartAndEnd
    }

    public static class LoggerBlockExtensions
    {
        public static LoggerBlock CreateBlockTrace(this ILogger logger, string state, BlockOutput output = BlockOutput.StartAndEnd)
        {
            return new LoggerBlock(logger, state, LogLevel.Trace, output);
        }

        public static LoggerBlock CreateBlockDebug(this ILogger logger, string state, BlockOutput output = BlockOutput.StartAndEnd)
        {
            return new LoggerBlock(logger, state, LogLevel.Debug, output);
        }

        public static LoggerBlock CreateBlockInfo(this ILogger logger, string state, BlockOutput output = BlockOutput.StartAndEnd)
        {
            return new LoggerBlock(logger, state, LogLevel.Information, output);
        }
    }

    public class LoggerBlock : IDisposable
    {
        private readonly Stopwatch stopwatch = new Stopwatch();
        private readonly ILogger logger;
        private readonly string state;
        private readonly LogLevel logLevel;

        public LoggerBlock(ILogger logger, string state, LogLevel logLevel, BlockOutput output)
        {
            this.logger = logger;
            this.state = state;
            this.logLevel = logLevel;

            if (output == BlockOutput.StartAndEnd)
                logger.Log(logLevel, 0, state, null, (s, exception) => state.ToString());

            stopwatch.Start();
        }

        public string EndState { get; set; }

        public void Dispose()
        {
            stopwatch.Stop();

            var message = $"{state} {(EndState == null ? string.Empty : "--> " + EndState)} [{GetElapsedTimeFormatted()}]";
            logger.Log(logLevel, 0, message, null, (state, exception) => message);
        }

        public void TraceTime(string text)
        {
            logger.LogTrace($"{text} [{GetElapsedTimeFormatted()}]");
        }

        private string GetElapsedTimeFormatted()
        {
            return string.Format("{0:00}:{1:00}:{2:00}.{3:000}", stopwatch.Elapsed.Hours, stopwatch.Elapsed.Minutes, stopwatch.Elapsed.Seconds, stopwatch.Elapsed.Milliseconds);
        }
    }
}