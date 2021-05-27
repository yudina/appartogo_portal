using AppartogoPortal.Core;
using Infrastructure;
using Infrastructure.Repository;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using System;
using System.IO;
using System.Linq;
using System.Text.Json.Serialization;
using AppartogoPortal.Hubs;

namespace AppartogoPortal
{
    public class Startup
    {
        private readonly IWebHostEnvironment environment;
        private readonly IConfigurationRoot configuration;

        public Startup(IConfiguration configuration, IWebHostEnvironment environment, IServiceProvider serviceProvider)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(environment.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{environment.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();

            this.configuration = builder.Build();
            this.environment = environment;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddRepository();
            services.AddSignalR();
            services.AddSingleton(environment);
            services.AddSingleton(configuration);
            services.AddSingleton<IConfiguration>(configuration);

            services.AddApplicationInsightsTelemetry();

            services.AddInfrastructure<AppSettings>(configuration, fileSystems: new[] { "Data" });

            services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddSingleton<Microsoft.Extensions.Localization.IStringLocalizer, ResourceManagerStringLocalizer>();
            services.AddControllersWithViews();
            var mvcBuilder = services
                .AddMvc(option => option.EnableEndpointRouting = false)
                .SetCompatibilityVersion(CompatibilityVersion.Latest)
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                })
                .AddXmlSerializerFormatters();

            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "Appartogoclient/build";
            });

#if DEBUG
            mvcBuilder.AddRazorRuntimeCompilation();
#endif
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
                app.UseDeveloperExceptionPage();
            else
                app.UseExceptionHandler("/Home/Error");

            var cachePeriod = env.IsDevelopment() ? "5" : "31536000"; //5s vs 30 days
            app.UseStaticFiles(new StaticFileOptions
            {
                OnPrepareResponse = ctx => { ctx.Context.Response.Headers.Append("Cache-Control", $"public, max-age={cachePeriod}"); }
            });

            
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
                endpoints.MapHub<ChatHub>("/chathub");
            });

            
            app.UseSpa(spa =>
            {
                spa.Options.SourcePath ="Appartogoclient";
                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}