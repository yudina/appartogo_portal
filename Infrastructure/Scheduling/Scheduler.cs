using Infrastructure.Extensions;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;

namespace Infrastructure.Scheduling
{
    public class Scheduler : IScheduler
    {
        private const int TimerDelay = 100;
        private const int TimerPrecision = 1000;

        private static readonly List<ScheduledTask> Tasks = new List<ScheduledTask>();
        private static readonly object SyncObject = new object();

        public Scheduler()
        {
            if (Timer == null)
            {
                lock (SyncObject)
                {
                    if (Timer == null)
                    {
                        Timer = new Timer(ExecuteTasks, null, TimerDelay, TimerPrecision);
                    }
                }
            }
        }

        [DebuggerStepThrough]
        public ScheduledTask AddTask(TimeSpan interval, Action action)
        {
            if (interval == TimeSpan.Zero)
                throw new ArgumentOutOfRangeException(nameof(interval), $"{nameof(interval)} must be greater than zero.");

            var task = new ScheduledTask(DateTimeProvider.UtcNow.Add(interval), interval, action);

            lock (SyncObject)
            {
                Tasks.Add(task);
            }

            return task;
        }

        private static Timer Timer { get; set; }

        [DebuggerStepThrough]
        private void ExecuteTasks(object state)
        {
            try
            {
                var toExecute = new List<ScheduledTask>();

                var now = DateTimeProvider.UtcNow;
                lock (SyncObject)
                {
                    toExecute.AddRange(Tasks.FindAll(t => t.NextRunDate <= now && !t.IsRunning));

                    if (toExecute.Count == 0)
                        return;
                }

                toExecute.ForEach(SafeExecute);
            }
            catch (Exception exception)
            {
                var message = $"TryCatch Missing !!! Scheduler is unable to execute tasks \n {exception}";
                Console.WriteLine(message);
                Debug.WriteLine(message);
            }
        }

        [DebuggerStepThrough]
        private void SafeExecute(ScheduledTask task)
        {
            if (task == null)
                return;

            try
            {
                lock (task.SyncObject)
                {
                    if (task.IsRunning)
                        return;

                    task.IsRunning = true;
                }

                task.Execute();
            }
            catch (Exception exception)
            {
                var message = $"TryCatch Missing !!! Scheduler is unable to execute tasks \n {exception}";
                Console.WriteLine(message);
                Debug.WriteLine(message);
            }
            finally
            {
                lock (task.SyncObject)
                {
                    task.IsRunning = false;

                    if (task.Interval != TimeSpan.Zero)
                        task.NextRunDate = DateTimeProvider.UtcNow.Add(task.Interval);
                }
            }
        }
    }
}
