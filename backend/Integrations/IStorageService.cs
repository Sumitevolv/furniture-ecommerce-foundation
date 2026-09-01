namespace FurnitureShop.Api.Integrations;

public record UploadResult(string Url, string StorageKey);

/// <summary>
/// Single storage contract so the rest of the app doesn't care whether
/// Cloudinary or S3 is configured — swap the DI registration in
/// Program.cs to switch providers.
/// </summary>
public interface IStorageService
{
    Task<UploadResult> UploadImageAsync(Stream fileStream, string fileName, string folder, CancellationToken ct = default);
    Task DeleteImageAsync(string storageKey, CancellationToken ct = default);
}
