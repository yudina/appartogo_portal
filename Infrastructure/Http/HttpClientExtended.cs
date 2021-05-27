using Infrastructure.Exceptions;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Http
{
    public class HttpClientExtended : IDisposable
    {
        private readonly HttpClient client;
        private readonly ILogger logger;

        public HttpClientExtended(string endPoint, ILogger logger, Dictionary<string, string> headers = null)
        {
            client = new HttpClient
            {
                BaseAddress = new Uri(endPoint)
            };

            if (headers != null)
            {
                foreach (var header in headers)
                    client.DefaultRequestHeaders.Add(header.Key, header.Value);
            }

            this.logger = logger;
        }

        public void Dispose()
        {
            client?.Dispose();
        }

        public async Task<T> GetAsync<T>(string url)
        {
            var response = await client.GetAsync(url);
            if (response.StatusCode == HttpStatusCode.Unauthorized)
                throw new UnauthorizedException();
            response.EnsureSuccessStatusCode();

            var data = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<T>(data);
        }

        public async Task PostAsync<TIn>(string url, TIn content)
        {
            var httpContent = PrepareRequestBody(content);
            var response = await client.PostAsync(url, httpContent);
            EnsureSuccess(response);
        }

        public async Task<TOut> PostAsync<TIn, TOut>(string url, TIn content)
        {
            var httpContent = PrepareRequestBody(content);
            var response = await client.PostAsync(url, httpContent);
            EnsureSuccess(response);
            return await ParseResponse<TOut>(response);
        }

        public async Task PutAsync<TIn>(string url, TIn content)
        {
            var httpContent = PrepareRequestBody(content);
            var response = await client.PutAsync(url, httpContent);
            EnsureSuccess(response);
        }

        public async Task DeleteAsync<TIn>(string url, TIn content)
        {
            var request = new HttpRequestMessage(HttpMethod.Delete, url)
            {
                Content = new StringContent(JsonConvert.SerializeObject(content), Encoding.UTF8, "application/json")
            };
            var response = await client.SendAsync(request);
            EnsureSuccess(response);
        }

        private static StringContent PrepareRequestBody<TIn>(TIn content)
        {
            var data = JsonConvert.SerializeObject(content);
            var httpContent = new StringContent(data, Encoding.UTF8, "application/json");
            return httpContent;
        }

        private static void EnsureSuccess(HttpResponseMessage response)
        {
            if (response.StatusCode == HttpStatusCode.Unauthorized)
                throw new UnauthorizedException();
            if (response.StatusCode == HttpStatusCode.Forbidden)
                throw new ForbiddenException();
            response.EnsureSuccessStatusCode();
        }

        private async Task<TResponse> ParseResponse<TResponse>(HttpResponseMessage response)
        {
            var value = await response.Content.ReadAsStringAsync();
            if (!string.IsNullOrEmpty(value))
            {
                try
                {
                    return JsonConvert.DeserializeObject<TResponse>(value);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, $"Unable to parse the response of type '{typeof(TResponse).Name}'. Response text:\r\n{value}");
                    throw;
                }
            }

            return default;
        }
    }
}