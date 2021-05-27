namespace AppartogoApiClient
{
    public class Media
    {
        public int Id { get; set; }
        public string SourceUrl { get; set; }

        public string FileName { get { return $"{Id}.jpg"; } }
    }
}