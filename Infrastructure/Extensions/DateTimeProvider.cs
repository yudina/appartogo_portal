using System;
using System.Diagnostics;

namespace Infrastructure.Extensions
{
    [DebuggerStepThrough]
    public static class DateTimeProvider
    {
        private static IDateTimeProvider dateTimeProvider;

        public interface IDateTimeProvider
        {
            DateTime UtcNow { get; }

            void Set(DateTime time);

            void Reset();
        }

        public static DateTime UtcNow => dateTimeProvider.UtcNow;

        public static void Configure(IDateTimeProvider provider)
        {
            dateTimeProvider = provider;
        }

        public static void Set(DateTime time)
        {
            dateTimeProvider.Set(time);
        }

        public static void Reset()
        {
            dateTimeProvider.Reset();
        }

        public class SystemProvider : IDateTimeProvider
        {
            public DateTime UtcNow => DateTime.UtcNow;

            public void Set(DateTime time)
            {
                throw new NotSupportedException(nameof(Set));
            }

            public void Reset()
            {
                throw new NotSupportedException(nameof(Reset));
            }
        }

        public class UnitTestProvider : IDateTimeProvider
        {
            private DateTime internalDateTime = DateTime.UtcNow;

            public DateTime UtcNow => internalDateTime;

            public void Set(DateTime time)
            {
                if (time.Kind != DateTimeKind.Utc)
                {
                    time = time.ToUniversalTime();
                }

                internalDateTime = time;
            }

            public void Reset()
            {
                internalDateTime = DateTime.UtcNow;
            }
        }
    }
}
