using System.Globalization;

namespace ElectroBuy.Api.Middleware;

public class LanguageMiddleware
{
    private readonly RequestDelegate _next;
    private static readonly string DefaultLanguage = "en";
    private static readonly string[] SupportedLanguages = { "en", "zh" };

    public LanguageMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var language = DefaultLanguage;

        if (context.Request.Headers.TryGetValue("Accept-Language", out var acceptLanguage))
        {
            var headerLanguage = acceptLanguage.ToString();
            
            var primaryLanguage = headerLanguage.Split(',')[0].Split('-')[0].Trim();
            
            if (SupportedLanguages.Contains(primaryLanguage))
            {
                language = primaryLanguage;
            }
        }

        context.Items["Language"] = language;

        await _next(context);
    }
}
