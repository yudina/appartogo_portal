using Infrastructure.Scheduling;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;

namespace Infrastructure.Caches
{
    public class CacheRefreshable
    {
        private readonly string name;
        private readonly TimeSpan cacheExpirationDelay;
        private readonly ILogger logger;
        private readonly Func<Task> refreshCallback;
        private bool cachedLoaded;
        private static SemaphoreSlim semaphore = new SemaphoreSlim(1, 1);

        public CacheRefreshable(string name, IScheduler scheduler, TimeSpan cacheExpirationDelay, ILogger logger, Func<Task> refreshCallback)
        {
            this.name = name;
            this.cacheExpirationDelay = cacheExpirationDelay;
            this.logger = logger;
            this.refreshCallback = refreshCallback;

            Task.Run(async () => { await RefreshAsync(); }).Wait();
            if (cacheExpirationDelay.TotalMilliseconds > 0)
                scheduler.AddTask(cacheExpirationDelay, async () => { await RefreshAsync(); });
        }

        public Task WaitForCache()
        {
            var sw = Stopwatch.StartNew();
            while (!cachedLoaded && sw.ElapsedMilliseconds <= cacheExpirationDelay.TotalMilliseconds)
                Thread.Sleep(100);
            return Task.CompletedTask;
        }

        public async Task ForceRefreshAsync()
        {
            await RefreshAsync();
        }

        private async Task RefreshAsync()
        {
            using (logger.CreateBlockTrace($"{name}.Refresh"))
            {
                await semaphore.WaitAsync();
                try
                {
                    await refreshCallback();
                    cachedLoaded = true;
                }
                finally
                {
                    semaphore.Release();
                }
            }
        }
    }
}