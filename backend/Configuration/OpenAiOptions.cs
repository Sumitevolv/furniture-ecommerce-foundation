namespace FurnitureShop.Api.Configuration;

public class OpenAiOptions
{
    public const string SectionName = "OpenAi";

    public string ApiKey { get; set; } = string.Empty;
    public string ChatModel { get; set; } = "gpt-4o-mini";
    public int MaxTokens { get; set; } = 500;
    public bool Enabled { get; set; } = true;
}
