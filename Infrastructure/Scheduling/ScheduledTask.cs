using System;

namespace Infrastructure.Scheduling
{
    public class ScheduledTask
    {
        public object SyncObject = new object();

        public ScheduledTask(DateTime nextRunDate, Action action) : this(nextRunDate, TimeSpan.Zero, action)
        {
        }

        public ScheduledTask(DateTime nextRunDate, TimeSpan interval, Action action)
        {
            NextRunDate = nextRunDate;
            Action = action;
            Interval = interval;
        }

        public DateTime NextRunDate { get; internal set; }

        public TimeSpan Interval { get; }

        public bool IsRunning { get; internal set; }
        protected Action Action { get; set; }

        public void Execute()
        {
            Action?.Invoke();
        }
    }
}
