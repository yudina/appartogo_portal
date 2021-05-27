namespace Infrastructure.Localize
{
    public class PropertyValue
    {
        public string Name { get; set; }
        public Localized<string> Values { get; set; }
    }
}
