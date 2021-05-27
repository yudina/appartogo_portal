using Microsoft.WindowsAzure.Storage;
using System;
using System.Collections.Generic;

namespace Infrastructure.FileSystem
{
    public static class StorageHelpers
    {
        public static IEnumerable<string> GetContainers(string storageSetting)
        {
            throw new NotImplementedException();
        }

        public static string GetAccountNameFromStorageConnectionString(string connectionString)
        {
            var elements = connectionString.Split(';');
            foreach (var element in elements)
            {
                var parts = element.Split('=');
                if (parts.Length == 2)
                {
                    if (parts[0] == "AccountName")
                    {
                        return parts[1];
                    }
                }
            }
            return "<invalid>";
        }

        internal static CloudStorageAccount GetStorageAccount(string storageSetting)
        {
            return CloudStorageAccount.Parse(storageSetting);
        }
    }
}
