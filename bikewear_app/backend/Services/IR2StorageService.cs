using System.IO;
using System.Threading.Tasks;

namespace App.Services
{
    public sealed class R2ObjectData
    {
        public required Stream Content { get; init; }
        public required string ContentType { get; init; }
    }

    public interface IR2StorageService
    {
        Task UploadAsync(string key, Stream content, string contentType, long contentLength);
        Task<R2ObjectData?> GetAsync(string key);
        Task DeleteAsync(string key);
    }
}
