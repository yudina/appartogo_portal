namespace Infrastructure.Localize
{
    public enum PropertyType
    {
        Text,
        Html,
        Image,
        Icon,       //Font icon
        Color,
        Url,
        Email,
        Tel
    }

    public class Property
    {
        public Property()
        {
            Labels = new Localized<string>();
        }

        public string Name { get; set; }
        public PropertyType Type { get; set; }
        public Localized<string> Labels { get; set; }

        public override string ToString()
        {
            return $"{Name}={Labels} [Type={Type}]";
        }
    }
}
