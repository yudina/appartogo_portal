using System;

namespace AppartogoApiClient
{
    public class Blog
    {
        public DateTime CreationDate { get; set; }
        public string Language { get; set; }
        public string AuthorName { get; set; }
        public string ImageUrl { get; set; }
        public string Category { get; set; }
        public string Title { get; set; }
        public string Summary { get; set; }
        public string Body { get; set; }
    }
}