namespace FurnitureShop.Api.DTOs.Common;

/// <summary>
/// Uniform envelope returned by every endpoint so the frontend can handle
/// success/error/validation consistently. Mirrors frontend/types/api.ts.
/// </summary>
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public string? Message { get; set; }
    public List<ApiFieldError>? Errors { get; set; }

    public static ApiResponse<T> Ok(T data, string? message = null) =>
        new() { Success = true, Data = data, Message = message };

    public static ApiResponse<T> Fail(string message, List<ApiFieldError>? errors = null) =>
        new() { Success = false, Message = message, Errors = errors };
}

public class ApiFieldError
{
    public string Field { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

public class PaginatedResponse<T>
{
    public List<T> Items { get; set; } = new();
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalItems { get; set; }
    public int TotalPages { get; set; }
}

public class PaginationParams
{
    private const int MaxPageSize = 100;
    private int _pageSize = 12;

    public int Page { get; set; } = 1;

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value > MaxPageSize ? MaxPageSize : value;
    }

    public string? SortBy { get; set; }
    public string SortDirection { get; set; } = "asc";
}
