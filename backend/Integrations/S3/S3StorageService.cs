using Amazon.S3;
using Amazon.S3.Model;
using FurnitureShop.Api.Configuration;
using Microsoft.Extensions.Options;

namespace FurnitureShop.Api.Integrations.S3;

/// <summary>
/// Product/category image storage via AWS S3. Registered as
/// IStorageService when Storage:Provider = "S3" (see Program.cs).
/// Kept in the same Integrations/Cloudinary-adjacent area since both
/// implement the shared IStorageService contract and are interchangeable.
/// </summary>
public class S3StorageService : IStorageService
{
    private readonly IAmazonS3 _s3Client;
    private readonly S3Options _options;

    public S3StorageService(IAmazonS3 s3Client, IOptions<S3Options> options)
    {
        _s3Client = s3Client;
        _options = options.Value;
    }

    public async Task<UploadResult> UploadImageAsync(Stream fileStream, string fileName, string folder, CancellationToken ct = default)
    {
        var key = $"{folder}/{Guid.NewGuid()}-{fileName}";

        var request = new PutObjectRequest
        {
            BucketName = _options.BucketName,
            Key = key,
            InputStream = fileStream,
            CannedACL = S3CannedACL.PublicRead,
        };

        await _s3Client.PutObjectAsync(request, ct);

        var url = !string.IsNullOrEmpty(_options.CdnBaseUrl)
            ? $"{_options.CdnBaseUrl.TrimEnd('/')}/{key}"
            : $"https://{_options.BucketName}.s3.{_options.Region}.amazonaws.com/{key}";

        return new UploadResult(url, key);
    }

    public async Task DeleteImageAsync(string storageKey, CancellationToken ct = default)
    {
        await _s3Client.DeleteObjectAsync(new DeleteObjectRequest
        {
            BucketName = _options.BucketName,
            Key = storageKey,
        }, ct);
    }
}
