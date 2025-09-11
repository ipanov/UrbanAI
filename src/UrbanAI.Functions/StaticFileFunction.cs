using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using System.Net;

namespace UrbanAI.Functions;

/// <summary>
/// Azure Function to serve static files for the frontend application
/// </summary>
public class StaticFileFunction
{
    private readonly ILogger<StaticFileFunction> _logger;

    public StaticFileFunction(ILogger<StaticFileFunction> logger)
    {
        _logger = logger;
    }

    [Function("StaticFiles")]
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "app/{*path}")] HttpRequest req, string path)
    {
        try
        {
            var executingAssembly = System.Reflection.Assembly.GetExecutingAssembly();
            var functionAppDirectory = Path.GetDirectoryName(executingAssembly.Location);
            var staticFilesPath = Path.Combine(functionAppDirectory, "wwwroot", "app");

            // Default to index.html for SPA routing
            if (string.IsNullOrEmpty(path) || path == "/")
            {
                path = "index.html";
            }

            var filePath = Path.Combine(staticFilesPath, path);
            
            // Security check - ensure we don't serve files outside the app directory
            var fullStaticPath = Path.GetFullPath(staticFilesPath);
            var fullFilePath = Path.GetFullPath(filePath);
            
            if (!fullFilePath.StartsWith(fullStaticPath))
            {
                return new NotFoundResult();
            }

            if (!File.Exists(filePath))
            {
                // For SPA routing, return index.html for non-existent routes
                var indexPath = Path.Combine(staticFilesPath, "index.html");
                if (File.Exists(indexPath))
                {
                    var indexContent = await File.ReadAllBytesAsync(indexPath);
                    return new FileContentResult(indexContent, "text/html");
                }
                return new NotFoundResult();
            }

            var fileContent = await File.ReadAllBytesAsync(filePath);
            var contentType = GetContentType(filePath);

            return new FileContentResult(fileContent, contentType);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error serving static file: {Path}", path);
            return new StatusCodeResult((int)HttpStatusCode.InternalServerError);
        }
    }

    private static string GetContentType(string filePath)
    {
        var extension = Path.GetExtension(filePath).ToLowerInvariant();
        return extension switch
        {
            ".html" => "text/html",
            ".css" => "text/css",
            ".js" => "application/javascript",
            ".json" => "application/json",
            ".png" => "image/png",
            ".jpg" or ".jpeg" => "image/jpeg",
            ".gif" => "image/gif",
            ".svg" => "image/svg+xml",
            ".ico" => "image/x-icon",
            ".woff" => "font/woff",
            ".woff2" => "font/woff2",
            ".ttf" => "font/ttf",
            ".eot" => "application/vnd.ms-fontobject",
            _ => "application/octet-stream"
        };
    }
}