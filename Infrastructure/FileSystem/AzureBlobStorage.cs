using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.FileSystem
{
    internal class AzureBlobStorage
    {
        public string Name => container.Name;

        public static async Task<AzureBlobStorage> CreateAsync(string storageSetting, string containerName, bool createIfNotExists = true)
        {
            var storageAccount = StorageHelpers.GetStorageAccount(storageSetting);

            var blobClient = storageAccount.CreateCloudBlobClient();
            var blobStorage = new AzureBlobStorage { container = blobClient.GetContainerReference(containerName) };

            if (createIfNotExists)
            {
                await blobStorage.container.CreateIfNotExistsAsync();
            }

            return blobStorage;
        }

        #region Enumeration

        public async Task<IEnumerable<IListBlobItem>> GetBlobsAsync(string path = "", bool useFlatBlobListing = false)
        {
            BlobContinuationToken continuationToken = null;
            var results = new List<IListBlobItem>();
            do
            {
                var blobListingDetails = BlobListingDetails.None;
                var maxBlobsPerRequest = 500;
                var response = await container.ListBlobsSegmentedAsync(path, useFlatBlobListing, blobListingDetails, maxBlobsPerRequest, continuationToken, null, null);
                continuationToken = response.ContinuationToken;
                results.AddRange(response.Results);
            }
            while (continuationToken != null);
            return results;
        }

        public CloudBlob GetBlob(string key)
        {
            return container.GetBlobReference(key);
        }

        public async Task<bool> ExistsAsync(string key)
        {
            try
            {
                var exists = await GetBlob(key).ExistsAsync();

                return exists;
            }
            catch (StorageException e)
            {
                if (e.RequestInformation.HttpStatusCode == 404)
                {
                    return false;
                }

                throw;
            }
        }

        #endregion Enumeration

        #region Upload

        public async Task UploadBytesAsync(string key, byte[] bytes, string contentType = null)
        {
            var blobReference = container.GetBlockBlobReference(key);
            await blobReference.UploadFromByteArrayAsync(bytes, 0, bytes.Length);

            if (contentType != null)
            {
                if (contentType != null)
                    blobReference.Properties.ContentType = contentType;
                blobReference.SetPropertiesAsync().Wait();
            }
        }

        public async Task UploadTextAsync(string key, string text, Encoding encoding = null)
        {
            var blobReference = container.GetBlockBlobReference(key);
            await blobReference.UploadTextAsync(text);
        }

        public async Task AppendTextAsync(string key, string text)
        {
            try
            {
                var appendBlobReference = container.GetAppendBlobReference(key);
                await appendBlobReference.AppendTextAsync(text);
            }
            catch
            {
                //Validate blob existance (if not, create + append)
                var blobReference = container.GetBlobReference(key);
                if (!await blobReference.ExistsAsync())
                {
                    var appendBlobReference = container.GetAppendBlobReference(key);
                    await appendBlobReference.CreateOrReplaceAsync();
                    await appendBlobReference.AppendTextAsync(text);
                    return;
                }

                //Validate blob type
                var blobReferenceFromServer = await container.GetBlobReferenceFromServerAsync(key);
                switch (blobReferenceFromServer.BlobType)
                {
                    case BlobType.BlockBlob:
                        {
                            //Changing the blobType to AppendBlob

                            // - Get Blob's Content
                            var content = await DownloadTextAsync(key);
                            // - Delete Blob
                            await blobReferenceFromServer.DeleteAsync();
                            // - Recursive call AppendTextAsync(key, content + text)
                            await AppendTextAsync(key, content + text);
                        }
                        break;

                    case BlobType.AppendBlob:
                        {
                            var appendBlobReference = container.GetAppendBlobReference(key);
                            await appendBlobReference.AppendTextAsync(text);
                        }
                        break;

                    default:
                        throw new NotImplementedException();
                }
            }
        }

        public async Task UploadStreamAsync(string key, Stream stream, int cacheSecond = 0, string contentType = null)
        {
            var blobReference = container.GetBlockBlobReference(key);
            stream.Seek(0, SeekOrigin.Begin);
            await blobReference.UploadFromStreamAsync(stream);

            if (cacheSecond > 0 || contentType != null)
            {
                if (cacheSecond > 0)
                    blobReference.Properties.CacheControl = $"public, max-age={cacheSecond}";
                if (contentType != null)
                    blobReference.Properties.ContentType = contentType;
                blobReference.SetPropertiesAsync().Wait();
            }
        }

        #endregion Upload

        #region Download

        public async Task<byte[]> DownloadBytesAsync(string key)
        {
            try
            {
                var cloudBlockBlob = container.GetBlockBlobReference(key);
                using (var memoryStream = new MemoryStream())
                {
                    await cloudBlockBlob.DownloadToStreamAsync(memoryStream);
                    return memoryStream.ToArray();
                }
            }
            catch (StorageException ex)
            {
                //If the blob doesn't exists, AzureStorageApi will throw a 404 StorageException
                if (ex.RequestInformation.HttpStatusCode == 404)
                {
                    return null;
                }

                throw;
            }
        }

        public async Task<int> DownloadToStreamAsync(string key, Stream stream)
        {
            try
            {
                var cloudBlob = container.GetBlobReference(key);
                await cloudBlob.DownloadToStreamAsync(stream);
                return 200;
            }
            catch (StorageException ex)
            {
                return ex.RequestInformation.HttpStatusCode;
            }
        }

        internal async Task<int> SetContentTypeAsync(string key, string contentType)
        {
            try
            {
                var cloudBlob = container.GetBlobReference(key);
                await cloudBlob.FetchAttributesAsync();
                cloudBlob.Properties.ContentType = contentType;
                await cloudBlob.SetPropertiesAsync();
                return 200;
            }
            catch (StorageException ex)
            {
                return ex.RequestInformation.HttpStatusCode;
            }
        }

        public async Task<string> DownloadTextAsync(string key, Encoding encoding = null)
        {
            try
            {
                try
                {
                    return await container.GetBlockBlobReference(key).DownloadTextAsync();
                }
                catch
                {
                    var blobReference = await container.GetBlobReferenceFromServerAsync(key);
                    switch (blobReference.BlobType)
                    {
                        case BlobType.BlockBlob:
                            return await container.GetBlockBlobReference(key).DownloadTextAsync();

                        case BlobType.AppendBlob:
                            return await container.GetAppendBlobReference(key).DownloadTextAsync();

                        default:
                            throw new NotImplementedException();
                    }
                }
            }
            catch (StorageException ex)
            {
                //If the blob doesn't exists, AzureStorageApi will throw a 404 StorageException
                if (ex.RequestInformation.HttpStatusCode == 404)
                {
                    return null;
                }

                throw;
            }
        }

        public async Task DeleteAsync(string key)
        {
            await container.GetBlockBlobReference(key).DeleteAsync();
        }

        #endregion Download

        #region Edition

        public async Task DeleteBlobAsync(CloudBlob blob)
        {
            await blob.DeleteAsync();
        }

        #endregion Edition

        #region Private methods

        private AzureBlobStorage()
        {
            // Private Constructor to ensure that the Factory pattern is used
        }

        #endregion Private methods

        #region Fields

        private CloudBlobContainer container;

        #endregion Fields
    }
}