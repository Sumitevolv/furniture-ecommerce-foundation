using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using FurnitureShop.Api.Configuration;
using Microsoft.Extensions.Options;

namespace FurnitureShop.Api.Integrations.Cloudinary;

/// <summary>
/// Product/category image storage via Cloudinary. Registered as
/// IStorageService when Storage:Provider = "Cloudinary" (see Program.cs).
/// </summary>
public class CloudinaryStorageService : IStorageService
{
    private readonly CloudinaryDotNet.Cloudinary _cloudinary;

    public CloudinaryStorageService(IOptions<CloudinaryOptions> options)
    {
        var settings = options.Value;
        var account = new Account(settings.CloudName, settings.ApiKey, settings.ApiSecret);
        _cloudinary = new CloudinaryDotNet.Cloudinary(account);
    }

    public async Task<UploadResult> UploadImageAsync(Stream fileStream, string fileName, string folder, CancellationToken ct = default)
    {
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(fileName, fileStream),
            Folder = $"furniture-shop/{folder}",
            UseFilename = true,
            UniqueFilename = true,
            Overwrite = false,
        };

        var result = await _cloudinary.UploadAsync(uploadParams, ct);

        if (result.Error != null)
        {
            throw new InvalidOperationException($"Cloudinary upload failed: {result.Error.Message}");
        }

        return new UploadResult(result.SecureUrl.ToString(), result.PublicId);
    }

    public async Task DeleteImageAsync(string storageKey, CancellationToken ct = default)
    {
        var deleteParams = new DeletionParams(storageKey);
        await _cloudinary.DestroyAsync(deleteParams);
    }
}
