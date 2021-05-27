using System;
using System.Collections.Generic;

namespace Infrastructure.FileSystem
{
    public enum FileSystemType
    {
        Unknown,
        Azure,
        Disk
    }

    public class FileSystemConfiguration
    {
        public FileSystemType Type { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
        public Dictionary<string, object> Properties { get; set; }

        public object GetProperty(string propertyName)
        {
            if (Properties == null)
            {
                return null;
            }

            return Properties.TryGetValue(propertyName, out var value) ? value : null;
        }

        public string GetPropertyString(string propertyName, string defaultValue)
        {
            var value = GetProperty(propertyName) as string;
            return value == null ? defaultValue : value;
        }

        public bool GetPropertyBool(string propertyName, bool defaultValue)
        {
            var value = GetProperty(propertyName);
            if (value == null)
            {
                return defaultValue;
            }

            if (bool.TryParse(value.ToString(), out var bValue))
            {
                return bValue;
            }

            throw new Exception($"FileSystemConfiguration.GetPropertyBool : Invalid bool value '{value}' for property name '{propertyName}'");
        }

        public override string ToString()
        {
            return $"{Name} | {Type} | {Value}";
        }
    }
}
