using Infrastructure.Exceptions;
using Infrastructure.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppartogoApiClient
{
    public class ApiClient : IDisposable
    {
        private HttpClientExtended client;

        public ApiClient(string endPoint, string apiKey, string apiSecret, ILogger logger)
        {
            var headers = new Dictionary<string, string> {
                { "ApiKey", apiKey },
                { "ApiSecret", apiSecret }
            };
            client = new HttpClientExtended(endPoint, logger, headers);
        }

        public void Dispose()
        {
            client?.Dispose();
            client = null;
        }

        public async Task<List<Listing>> GetListingsAsync(string organizationId = null)
        {
            var url = "api/listings";
            if (!string.IsNullOrEmpty(organizationId))
                url += $"?organizationid={organizationId}";

            return await client.GetAsync<List<Listing>>(url);
        }

        public async Task<List<IListingBase>> GetListingsCondensedAsync()
        {
            var listings = await client.GetAsync<List<ListingBase>>("api/listings?condensed=true");
            return listings.Cast<IListingBase>().ToList();
        }

        public async Task<List<int>> CreateListingsAsync(List<Listing> listings)
        {
            var response = await client.PostAsync<List<Listing>, ApiResponse<List<int>>>("api/listings", listings);
            if (response == null)
                return new List<int>();

            if (response.Result.Count != listings.Count)
                throw new BadRequestException($"The number of listings created doesn't match. Sent {listings.Count}, created {response.Result.Count}.");

            return response.Result;
        }

        public async Task UpdateListingsAsync(List<Listing> listings)
        {
            await client.PutAsync("api/listings", listings);
        }

        public async Task RemoveListingsAsync(List<Listing> listings)
        {
            await client.DeleteAsync("api/listings", listings);
        }

        public async Task<int> UploadMediaAsync(string url, byte[] bytes)
        {
            var mediaUploadRequest = new MediaUploadRequest
            {
                SourceUrl = url,
                Content = bytes == null ? null : Convert.ToBase64String(bytes)
            };

            var response = await client.PostAsync<MediaUploadRequest, ApiResponse<int>>("api/medias", mediaUploadRequest);
            if (response == null)
                return -1;
            return response.Result;
        }

        public async Task<IList<Media>> GetMediasAsync()
        {
            return await client.GetAsync<List<Media>>("api/medias");
        }

        public async Task AddOrUpdateCrawlRecordAsync(CrawlRecord crawlRecord)
        {
            var crawId = await client.PostAsync<CrawlRecord, int>("api/crawls", crawlRecord);
            if (crawlRecord.Id != crawId)
                crawlRecord.Id = crawId;
        }
    }
}