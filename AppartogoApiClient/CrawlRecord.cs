using Infrastructure.Extensions;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;

namespace AppartogoApiClient
{
    public class CrawlRecord
    {
        private ILogger Logger;

        public int Id { get; set; }
        public States State { get; set; } = States.Executing;
        public DateTime StarteddOn { get; set; }
        public DateTime? FinishedOn { get; set; }
        public bool BuildMode { get; private set; }
        public int ListingCount { get; set; }

        public int MediaCreated { get; set; }
        public int MergeCount { get; set; }

        public Dictionary<string, Source> Sources { get; set; } = new Dictionary<string, Source>();
        public List<Message> Messages { get; set; } = new List<Message>();

        public static CrawlRecord Create(List<string> crawlerNames, ILogger logger, bool buildMode)
        {
            var crawlRecord = new CrawlRecord { StarteddOn = DateTime.UtcNow, Logger = logger, BuildMode = buildMode };

            foreach (var crawlerName in crawlerNames)
                crawlRecord.Sources.Add(crawlerName, new Source { Name = crawlerName });

            return crawlRecord;
        }

        public void Finish(int listingCount)
        {
            FinishedOn = DateTime.UtcNow;
            State = States.Finished;
            ListingCount = listingCount;
        }

        public static string GetTextColorCallLevel(int calls)
        {
            if (calls > 500)
                return "text-danger";
            if (calls > 200)
                return "text-warning";
            return string.Empty;
        }

        public string ElapsedTimeFormatted()
        {
            if (State == States.Executing || State == States.Finished)
            {
                var finished = State == States.Executing ? DateTime.UtcNow : FinishedOn.Value;
                var delta = finished.Subtract(StarteddOn);
                return DateTimeUtils.ElapsedTimeFormatted(delta);
            }

            return string.Empty;
        }

        public enum States
        {
            Disabled = 1,
            Pending = 2,
            Executing = 3,
            Finished = 4,
        }

        public class Source
        {
            public string Name { get; set; }

            public States State { get; set; } = States.Pending;
            public DateTime StarteddOn { get; set; }
            public DateTime? FinishedOn { get; set; }

            public int ListUrlCount { get; set; }
            public int ListingExtractedCount { get; set; }
            public int ListingsCount { get; set; }
            public int InvalidRemoved { get; set; }
            public int ExpiredCount { get; set; }
            public int DeletedForUpdateCount { get; set; }
            public int ListingsDownloadCount { get; set; }
            public int SiteCalls { get; set; }

            public void Start()
            {
                StarteddOn = DateTime.UtcNow;
                State = States.Executing;
            }

            public void Finish(int listingCount)
            {
                FinishedOn = DateTime.UtcNow;
                ListingsCount = listingCount;
                State = States.Finished;
            }

            public string ElapsedTimeFormatted()
            {
                if (State == States.Executing || State == States.Finished)
                {
                    var finished = State == States.Executing ? DateTime.UtcNow : FinishedOn.Value;
                    var delta = finished.Subtract(StarteddOn);
                    return DateTimeUtils.ElapsedTimeFormatted(delta);
                }

                return string.Empty;
            }

            public double ElapsedTimeSeconds()
            {
                if (State == States.Executing || State == States.Finished)
                {
                    var finished = State == States.Executing ? DateTime.UtcNow : FinishedOn.Value;
                    var delta = finished.Subtract(StarteddOn);
                    return delta.TotalSeconds;
                }

                return 0;
            }
        }

        public enum Levels
        {
            Trace,
            Information,
            Warning,
            Error
        }

        public class Message
        {
            public DateTime Date { get; set; }
            public Levels Level { get; set; }
            public string Text { get; set; }
            public string Source { get; set; }

            public static Message Create(Levels level, string source, string text)
            {
                return new Message
                {
                    Date = DateTime.UtcNow,
                    Level = level,
                    Source = source,
                    Text = text
                };
            }

            public string GetLevelTextStyle()
            {
                if (Level == Levels.Error)
                    return "badge-danger";
                if (Level == Levels.Warning)
                    return "badge-warning";
                if (Level == Levels.Information)
                    return "badge-info";
                return "badge-light";
            }
        }

        public class Step
        {
            public States State { get; set; } = States.Pending;
            public int No { get; set; }
            public int Count { get; set; }
            public string Text { get; set; } = string.Empty;
        }

        public void AddDebug(string source, string text)
        {
            if (Logger != null)
                Logger.LogDebug($"[{source}] {text}");
            Messages.Add(Message.Create(Levels.Trace, source, text));
        }

        public void AddInformation(string source, string text)
        {
            if (Logger != null)
                Logger.LogInformation($"[{source}] {text}");
            Messages.Add(Message.Create(Levels.Information, source, text));
        }

        public static string GetTextStyle(States state)
        {
            if (state == States.Disabled)
                return "text-muted";
            if (state == States.Pending)
                return "text-info";
            if (state == States.Executing)
                return "text-light bg-dark";
            if (state == States.Finished)
                return "text-success";

            return string.Empty;
        }

        public static string GetBadgeStyle(States state)
        {
            if (state == States.Disabled)
                return "badge-light";
            if (state == States.Pending)
                return "badge-info";
            if (state == States.Executing)
                return "badge-dark";
            if (state == States.Finished)
                return "badge-success";

            return string.Empty;
        }
    }
}