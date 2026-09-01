using System.Text;
using FurnitureShop.Api.Authentication;
using FurnitureShop.Api.Configuration;
using FurnitureShop.Api.Data;
using FurnitureShop.Api.Helpers;
using FurnitureShop.Api.Hubs;
using FurnitureShop.Api.Integrations.Cloudinary;
using FurnitureShop.Api.Integrations.OpenAi;
using FurnitureShop.Api.Integrations.Razorpay;
using FurnitureShop.Api.Integrations.S3;
using FurnitureShop.Api.Integrations.SignalR;
using FurnitureShop.Api.Middleware;
using FurnitureShop.Api.Repositories;
using FurnitureShop.Api.Repositories.Interfaces;
using FurnitureShop.Api.Services;
using FurnitureShop.Api.Services.Interfaces;
using Amazon.S3;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using FurnitureShop.Api.Integrations;

var builder = WebApplication.CreateBuilder(args);

// ---------------------------------------------------------------------
// Logging (Serilog)
// ---------------------------------------------------------------------
builder.Host.UseSerilog((context, configuration) =>
    configuration
        .ReadFrom.Configuration(context.Configuration)
        .Enrich.FromLogContext()
        .WriteTo.Console());

// ---------------------------------------------------------------------
// Strongly typed configuration (bound from appsettings + env vars —
// see .env.example for the full list of variables to set in production)
// ---------------------------------------------------------------------
builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection(JwtOptions.SectionName));
builder.Services.Configure<CloudinaryOptions>(builder.Configuration.GetSection(CloudinaryOptions.SectionName));
builder.Services.Configure<S3Options>(builder.Configuration.GetSection(S3Options.SectionName));
builder.Services.Configure<RazorpayOptions>(builder.Configuration.GetSection(RazorpayOptions.SectionName));
builder.Services.Configure<OpenAiOptions>(builder.Configuration.GetSection(OpenAiOptions.SectionName));
builder.Services.Configure<CorsOptions>(builder.Configuration.GetSection(CorsOptions.SectionName));

// ---------------------------------------------------------------------
// Database (PostgreSQL via EF Core)
// ---------------------------------------------------------------------
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Missing ConnectionStrings:DefaultConnection. Set it via appsettings or the DB_CONNECTION_STRING env var.");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString, npgsql => npgsql.EnableRetryOnFailure(3)));

// ---------------------------------------------------------------------
// Repositories
// ---------------------------------------------------------------------
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ICartRepository, CartRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
builder.Services.AddScoped<IAiConversationRepository, AiConversationRepository>();

// ---------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IAiService, AiService>();
builder.Services.AddScoped<IAdminService, AdminService>();

// ---------------------------------------------------------------------
// Authentication / current-user helpers
// ---------------------------------------------------------------------
builder.Services.AddSingleton<IJwtTokenService, JwtTokenService>();
builder.Services.AddSingleton<IPasswordHasher, BCryptPasswordHasher>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();

// ---------------------------------------------------------------------
// Integrations: storage (Cloudinary or S3, chosen via Storage:Provider),
// Razorpay, OpenAI, SignalR notifications
// ---------------------------------------------------------------------
var storageProvider = builder.Configuration["Storage:Provider"] ?? "Cloudinary";
if (string.Equals(storageProvider, "S3", StringComparison.OrdinalIgnoreCase))
{
    builder.Services.AddAWSService<IAmazonS3>();
    builder.Services.AddScoped<IStorageService, S3StorageService>();
}
else
{
    builder.Services.AddScoped<IStorageService, CloudinaryStorageService>();
}

builder.Services.AddScoped<IRazorpayService, RazorpayService>();
builder.Services.AddScoped<IOpenAiService, OpenAiService>();
builder.Services.AddScoped<INotificationService, NotificationService>();

// ---------------------------------------------------------------------
// Validation (FluentValidation, auto-validates on model binding)
// ---------------------------------------------------------------------
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddFluentValidationAutoValidation();

// ---------------------------------------------------------------------
// MVC + JSON
// ---------------------------------------------------------------------
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
});

// ---------------------------------------------------------------------
// CORS — only the configured frontend origin(s) may call the API
// ---------------------------------------------------------------------
const string CorsPolicyName = "FrontendPolicy";
var allowedOrigins = builder.Configuration.GetSection(CorsOptions.SectionName + ":AllowedOrigins").Get<string[]>()
    ?? new[] { "http://localhost:3000" };

builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicyName, policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()); // required for SignalR
});

// ---------------------------------------------------------------------
// JWT Authentication
// ---------------------------------------------------------------------
var jwtSection = builder.Configuration.GetSection(JwtOptions.SectionName);
var jwtSecret = jwtSection["Secret"]
    ?? throw new InvalidOperationException("Missing Jwt:Secret. Set it via the JWT_SECRET env var — never hardcode it.");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwtSection["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwtSection["Audience"],
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
        ClockSkew = TimeSpan.FromSeconds(30),
    };

    // Allow SignalR clients to authenticate via an access_token query param,
    // since browsers can't attach custom headers to WebSocket handshakes.
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        },
    };
});

builder.Services.AddAuthorization();

// ---------------------------------------------------------------------
// SignalR — real-time architecture for order status, stock alerts, etc.
// ---------------------------------------------------------------------
builder.Services.AddSignalR();

// ---------------------------------------------------------------------
// Swagger / OpenAPI (with JWT bearer support in the UI)
// ---------------------------------------------------------------------
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Furniture Shop API", Version = "v1" });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Enter 'Bearer {your JWT}'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" },
            },
            Array.Empty<string>()
        },
    });
});

var app = builder.Build();

// ---------------------------------------------------------------------
// Middleware pipeline
// ---------------------------------------------------------------------
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseMiddleware<RequestLoggingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(CorsPolicyName);
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<NotificationHub>("/hubs/notifications");

// ---------------------------------------------------------------------
// Development-only: apply migrations and seed demo data automatically.
// Never runs in Production — migrations there should be applied via a
// deliberate release step (e.g. `dotnet ef database update`).
// ---------------------------------------------------------------------
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await DbSeeder.SeedAsync(db);
}

app.Run();

public partial class Program { }
