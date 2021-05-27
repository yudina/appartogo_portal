using System;
using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace Infrastructure.Logging
{
    public static class ConsoleExtensions
    {
        public static void WriteColorfulLine(string message, ConsoleColor? backColor = null, ConsoleColor? foreColor = null)
        {
            var backgroundColor = Console.BackgroundColor;
            var foregroundColor = Console.ForegroundColor;

            if (backColor.HasValue)
                Console.BackgroundColor = backColor.Value;

            if (foreColor.HasValue)
                Console.ForegroundColor = foreColor.Value;

            Console.Write(message);

            Console.BackgroundColor = backgroundColor;
            Console.ForegroundColor = foregroundColor;

            Console.WriteLine();

            Debug.WriteLine(message);
        }

        public static void WriteExceptionToConsole(Exception exception, string message = null, [CallerMemberName] string callerMemberName = null, [CallerFilePath] string callerFilePath = null, [CallerLineNumber] int? callerLineNumber = null)
        {
            WriteColorfulLine($"EXCEPTION ! [at {callerMemberName} @ {callerFilePath}:{callerLineNumber}]", ConsoleColor.Red, ConsoleColor.White);

            if (!string.IsNullOrWhiteSpace(message))
                WriteColorfulLine($"{message}\n", foreColor: ConsoleColor.Red);

            WriteColorfulLine($"{exception.Message}\n\n{exception.StackTrace}", foreColor: ConsoleColor.Red);
        }
    }
}