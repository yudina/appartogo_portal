using System;

namespace Infrastructure.Scheduling
{
    public interface IScheduler
    {
        ScheduledTask AddTask(TimeSpan interval, Action action);
    }
}
