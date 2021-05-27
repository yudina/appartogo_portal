using Infrastructure.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Diagnostics;
using System.Runtime.CompilerServices;
using System.Text;

namespace AppartogoPortal.Core
{
    public abstract class ControllerBase<TController> : Controller
    {
        protected readonly AppSettings appSettings;
        protected readonly ILogger logger;
        private readonly IServiceProvider serviceProvider;

        private IStringLocalizer localizer;

        public ControllerBase(IServiceProvider serviceProvider)
        {
            this.serviceProvider = serviceProvider;
            appSettings = GetService<IOptions<AppSettings>>().Value;
            logger = GetService<ILogger<TController>>();
        }

        protected IStringLocalizer Localizer
        {
            get
            {
                if (localizer == null)
                    localizer = GetService<IStringLocalizer>();
                return localizer;
            }
        }

        public string Language => HttpContext.Request.GetLanguage();

        protected IActionResult HandleExceptionResponse(Exception ex, string contextDescription = null, [CallerMemberName] string callerMemberName = null, [CallerFilePath] string callerFilePath = null, [CallerLineNumber] int callerLineNumber = 0)
        {
            if (ex is BadRequestException)
                return BadRequest((ex as BadRequestException).HttpResponseMessage);

            if (ex is ValidationException)
                return BadRequest((ex as ValidationException).HttpResponseMessage);

            if (ex is NotFoundException)
                return NotFound((ex as NotFoundException).HttpResponseMessage);

            // Throw the exception, in order to use the DeveloperExceptionPageMiddleware
            UseDeveloperExceptionPage(ex);

            logger.LogError(ex, $"{typeof(TController).Name}.{callerMemberName} - {contextDescription} | {Request.GetInfo()} | Unhandled exception [{callerFilePath}:{callerLineNumber}]");
            return StatusCode(500); //Don't add debug messages to the response
        }

        protected TService GetService<TService>() where TService : class
        {
            return serviceProvider.GetService(typeof(TService)) as TService;
        }

        protected void LogRequest()
        {
            LogRequest(HttpContext, logger);
        }

        public static void LogRequest(HttpContext httpContext, ILogger logger)
        {
            var sb = new StringBuilder();
            sb.AppendLine(" ----- LogRequest START -----");
            sb.AppendLine($"\tQueryString={httpContext.Request.QueryString}");
            try
            {
                sb.AppendLine($"\tHeaders");
                foreach (var kvp in httpContext.Request.Headers)
                    sb.AppendLine($"\t\t{kvp.Key}='{kvp.Value}'");
            }
            catch { }
            try
            {
                sb.AppendLine($"\tCookies");
                foreach (var kvp in httpContext.Request.Cookies)
                    sb.AppendLine($"\t\t{kvp.Key}='{kvp.Value}'");
            }
            catch { }
            try
            {
                sb.AppendLine($"\tForm");
                foreach (var kvp in httpContext.Request.Form)
                    sb.AppendLine($"\t\t{kvp.Key}='{kvp.Value}'");
            }
            catch { }
            sb.AppendLine(" ----- LogRequest END  -----");

            logger.LogDebug(sb.ToString());
        }

        [Conditional("DEBUG")]
        private void UseDeveloperExceptionPage(Exception ex)
        {
            throw ex;
        }
    }
}