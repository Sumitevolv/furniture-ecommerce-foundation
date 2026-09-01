using System.Text;
using System.Text.RegularExpressions;

namespace FurnitureShop.Api.Helpers;

public static partial class SlugHelper
{
    public static string GenerateSlug(string value)
    {
        var normalized = value.Trim().ToLowerInvariant();
        normalized = DiacriticsRegex().Replace(RemoveDiacritics(normalized), "");
        normalized = NonAlphaNumericRegex().Replace(normalized, "-");
        normalized = MultipleHyphensRegex().Replace(normalized, "-");
        return normalized.Trim('-');
    }

    private static string RemoveDiacritics(string text)
    {
        var normalized = text.Normalize(NormalizationForm.FormD);
        var builder = new StringBuilder();
        foreach (var c in normalized)
        {
            var category = System.Globalization.CharUnicodeInfo.GetUnicodeCategory(c);
            if (category != System.Globalization.UnicodeCategory.NonSpacingMark)
            {
                builder.Append(c);
            }
        }
        return builder.ToString().Normalize(NormalizationForm.FormC);
    }

    [GeneratedRegex(@"\p{Mn}")]
    private static partial Regex DiacriticsRegex();

    [GeneratedRegex(@"[^a-z0-9]+")]
    private static partial Regex NonAlphaNumericRegex();

    [GeneratedRegex(@"-+")]
    private static partial Regex MultipleHyphensRegex();
}
