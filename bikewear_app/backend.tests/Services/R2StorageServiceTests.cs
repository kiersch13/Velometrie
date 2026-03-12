using System.IO;
using System.Text;
using System.Threading.Tasks;
using App.Services;
using Xunit;

namespace BackendTests.Services;

public class R2StorageServiceTests
{
    [Fact]
    public void CreatePutObjectRequest_SetsR2CompatibleUploadFlags()
    {
        using var stream = new MemoryStream(Encoding.UTF8.GetBytes("test-image"));

        var request = R2StorageService.CreatePutObjectRequest(
            "bike-photos",
            "bikes/1/photo-test.webp",
            stream,
            "image/webp",
            stream.Length);

        Assert.Equal("bike-photos", request.BucketName);
        Assert.Equal("bikes/1/photo-test.webp", request.Key);
        Assert.Equal("image/webp", request.ContentType);
        Assert.Same(stream, request.InputStream);
        Assert.False(request.AutoCloseStream);
        Assert.True(request.DisablePayloadSigning);
        Assert.True(request.DisableDefaultChecksumValidation);
        Assert.Equal(stream.Length, request.Headers.ContentLength);
    }

    [Fact]
    public async Task CreateObjectDataAsync_CopiesContentIntoReusableMemoryStream()
    {
        await using var source = new MemoryStream(Encoding.UTF8.GetBytes("photo-bytes"));

        var result = await R2StorageService.CreateObjectDataAsync(source, "image/png");

        Assert.Equal("image/png", result.ContentType);
        Assert.IsType<MemoryStream>(result.Content);

        using var reader = new StreamReader(result.Content, Encoding.UTF8, leaveOpen: true);
        Assert.Equal("photo-bytes", await reader.ReadToEndAsync());
        Assert.Equal(result.Content.Length, result.Content.Position);

        result.Content.Position = 0;
        using var secondReader = new StreamReader(result.Content, Encoding.UTF8, leaveOpen: true);
        Assert.Equal("photo-bytes", await secondReader.ReadToEndAsync());
    }
}