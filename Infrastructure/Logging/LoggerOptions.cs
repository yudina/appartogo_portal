using System;

namespace Infrastructure.Logging
{
    public class LoggerOptions
    {
        private int maxSize;
        private long milisecondsBetweenWrites;

        public string MainFileNamePattern { get; set; }

        public int MaxSize
        {
            get => maxSize;
            set
            {
                if (value <= 0)
                    throw new ArgumentOutOfRangeException(nameof(value), $"{nameof(MaxSize)} must be positive.");

                maxSize = value;
            }
        }

        public long MilisecondsBetweenWrites
        {
            get => milisecondsBetweenWrites;

            set
            {
                if (value <= 0)
                    throw new ArgumentOutOfRangeException(nameof(value), $"{nameof(MilisecondsBetweenWrites)} must be positive.");

                milisecondsBetweenWrites = value;
            }
        }

        public bool ShouldIncludeConsole { get; set; }
        public bool ClearOnStartup { get; internal set; }
    }
}