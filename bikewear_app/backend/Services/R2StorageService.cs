using System.IO;
using System.Net;
using System.Threading.Tasks;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Options;

namespace App.Services
{
    public class R2StorageService : IR2StorageService
    {
        private readonly R2Options _options;
        private readonly IAmazonS3? _s3Client;

        public R2StorageService(IOptions<R2Options> options)
        {
            _options = options.Value;

            if (_options.IsConfigured)
            {
                var credentials = new BasicAWSCredentials(_options.AccessKeyId, _options.SecretAccessKey);
                var config = new AmazonS3Config
                {
                    ServiceURL = $"https://{_options.AccountId}.r2.cloudflarestorage.com",
                    ForcePathStyle = true,
                    AuthenticationRegion = "auto"
                };

                _s3Client = new AmazonS3Client(credentials, config);
            }
        }

        private IAmazonS3 GetClientOrThrow()
        {
            return _s3Client ?? throw new InvalidOperationException(
                "R2 is not configured. Set R2__AccountId, R2__AccessKeyId, R2__SecretAccessKey, and R2__BucketName.");
        }

        public async Task UploadAsync(string key, Stream content, string contentType, long contentLength)
        {
            var client = GetClientOrThrow();
            var request = new PutObjectRequest
            {
                BucketName = _options.BucketName,
                Key = key,
                InputStream = content,
                ContentType = contentType,
                AutoCloseStream = false
            };
            request.Headers.ContentLength = contentLength;

            await client.PutObjectAsync(request);
        }

        public async Task<R2ObjectData?> GetAsync(string key)
        {
            var client = GetClientOrThrow();
            try
            {
                var response = await client.GetObjectAsync(_options.BucketName, key);
                return new R2ObjectData
                {
                    Content = response.ResponseStream,
                    ContentType = string.IsNullOrWhiteSpace(response.Headers.ContentType)
                        ? "application/octet-stream"
                        : response.Headers.ContentType
                };
            }
            catch (AmazonS3Exception ex) when (ex.StatusCode == HttpStatusCode.NotFound)
            {
                return null;
            }
        }

        public async Task DeleteAsync(string key)
        {
            var client = GetClientOrThrow();
            await client.DeleteObjectAsync(_options.BucketName, key);
        }
    }
}
