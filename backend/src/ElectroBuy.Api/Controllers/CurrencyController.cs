using Microsoft.AspNetCore.Mvc;

namespace ElectroBuy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CurrencyController : ControllerBase
{
    private static readonly Dictionary<string, decimal> ExchangeRates = new()
    {
        { "CNY_TO_USD", 0.14m },
        { "USD_TO_CNY", 7.14m },
        { "EUR_TO_USD", 1.08m },
        { "USD_TO_EUR", 0.93m },
        { "CNY_TO_EUR", 0.13m },
        { "EUR_TO_CNY", 7.70m }
    };

    [HttpGet("rates")]
    public IActionResult GetRates()
    {
        return Ok(new
        {
            baseCurrency = "CNY",
            rates = new Dictionary<string, decimal>
            {
                { "USD", 0.14m },
                { "EUR", 0.13m },
                { "CNY", 1.0m }
            },
            lastUpdated = DateTime.UtcNow
        });
    }

    [HttpPost("convert")]
    public IActionResult Convert([FromBody] ConvertRequest request)
    {
        if (request.Amount <= 0)
        {
            return BadRequest(new { error = "Amount must be greater than 0" });
        }

        var fromCurrency = request.FromCurrency.ToUpper();
        var toCurrency = request.ToCurrency.ToUpper();

        if (fromCurrency == toCurrency)
        {
            return Ok(new ConvertResponse
            {
                OriginalAmount = request.Amount,
                OriginalCurrency = fromCurrency,
                ConvertedAmount = request.Amount,
                ConvertedCurrency = toCurrency,
                ExchangeRate = 1.0m
            });
        }

        var rateKey = $"{fromCurrency}_TO_{toCurrency}";
        if (!ExchangeRates.TryGetValue(rateKey, out var rate))
        {
            return BadRequest(new { error = $"Conversion from {fromCurrency} to {toCurrency} is not supported" });
        }

        var convertedAmount = Math.Round(request.Amount * rate, 2);

        return Ok(new ConvertResponse
        {
            OriginalAmount = request.Amount,
            OriginalCurrency = fromCurrency,
            ConvertedAmount = convertedAmount,
            ConvertedCurrency = toCurrency,
            ExchangeRate = rate
        });
    }

    public class ConvertRequest
    {
        public decimal Amount { get; set; }
        public string FromCurrency { get; set; } = "CNY";
        public string ToCurrency { get; set; } = "USD";
    }

    public class ConvertResponse
    {
        public decimal OriginalAmount { get; set; }
        public string OriginalCurrency { get; set; } = string.Empty;
        public decimal ConvertedAmount { get; set; }
        public string ConvertedCurrency { get; set; } = string.Empty;
        public decimal ExchangeRate { get; set; }
    }
}
