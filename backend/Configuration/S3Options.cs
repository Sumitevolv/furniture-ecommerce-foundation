namespace FurnitureShop.Api.Configuration;

public class S3Options
{
    public const string SectionName = "AwsS3";

    public string AccessKeyId { get; set; } = string.Empty;
    public string SecretAccessKey { get; set; } = string.Empty;
    public string Region { get; set; } = "ap-south-1";
    public string BucketName { get; set; } = string.Empty;
    /// <summary>Optional CDN/CloudFront domain to serve objects from instead of the raw bucket URL.</summary>
    public string? CdnBaseUrl { get; set; }
}
