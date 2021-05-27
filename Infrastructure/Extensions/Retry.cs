using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Extensions
{
    public class Retry
    {
        public static async Task DoAsync(Action action, TimeSpan? retryInterval = null, Func<Task> error = null, int retryCount = 3)
        {
            await DoAsync<object>(() =>
            {
                action();
                return null;
            }, retryInterval, error, retryCount);
        }

        public static async Task<T> DoAsync<T>(Func<Task<T>> action, TimeSpan? retryInterval = null, Func<Task> error = null, int retryCount = 3)
        {
            var exceptions = new List<Exception>();

            for (var retry = 0; retry < retryCount; ++retry)
            {
                try
                {
                    return await action();
                }
                catch (Exception ex)
                {
                    exceptions.Add(ex);

                    if (error != null)
                        await error();

                    if (retryInterval.HasValue)
                        await Task.Delay(retryInterval.Value);
                }
            }

            throw new AggregateException(exceptions);
        }
    }
}