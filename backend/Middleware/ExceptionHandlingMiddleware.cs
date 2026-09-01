using System.Net;
using System.Text.Json;
using FurnitureShop.Api.DTOs.Common;
using FurnitureShop.Api.Helpers;

namespace FurnitureShop.Api.Middleware;

/// <summary>
/// Catches unhandled exceptions anywhere in the pipeline and converts them
/// into the standard ApiResponse envelope, so the frontend never has to
/// special-case raw ASP.NET error pages.
/// </summary>
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;
    private readonly IHostEnvironment _environment;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger, IHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception processing {Method} {Path}", context.Request.Method, context.Request.Path);
            await WriteErrorResponseAsync(context, ex);
        }
    }

    private async Task WriteErrorResponseAsync(HttpContext context, Exception exception)
    {
        var (statusCode, message) = MapException(exception);

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        var response = ApiResponse<object>.Fail(
            _environment.IsDevelopment() ? exception.Message : message);

        await context.Response.WriteAsync(JsonSerializer.Serialize(response, JsonDefaults.Options));
    }

    private static (HttpStatusCode StatusCode, string Message) MapException(Exception exception) => exception switch
    {
        AppException appEx => (appEx.StatusCode, appEx.Message),
        UnauthorizedAccessException => (HttpStatusCode.Unauthorized, "You are not authorized to perform this action."),
        KeyNotFoundException => (HttpStatusCode.NotFound, "The requested resource was not found."),
        _ => (HttpStatusCode.InternalServerError, "An unexpected error occurred. Please try again."),
    };
}

/// <summary>Base class for expected, mapped application errors (e.g. NotFoundException, ConflictException).</summary>
public class AppException : Exception
{
    public HttpStatusCode StatusCode { get; }

    public AppException(string message, HttpStatusCode statusCode = HttpStatusCode.BadRequest) : base(message)
    {
        StatusCode = statusCode;
    }
}

public class NotFoundException : AppException
{
    public NotFoundException(string message) : base(message, HttpStatusCode.NotFound) { }
}

public class ConflictException : AppException
{
    public ConflictException(string message) : base(message, HttpStatusCode.Conflict) { }
}

public class ValidationAppException : AppException
{
    public List<ApiFieldError> Errors { get; }

    public ValidationAppException(List<ApiFieldError> errors)
        : base("One or more validation errors occurred.", HttpStatusCode.UnprocessableEntity)
    {
        Errors = errors;
    }
}
