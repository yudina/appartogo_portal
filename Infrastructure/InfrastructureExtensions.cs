using Infrastructure.Caches;
using Infrastructure.Extensions;
using Infrastructure.FileSystem;
using Infrastructure.Logging;
using Infrastructure.Resources;
using Infrastructure.Scheduling;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Diagnostics;
using System.Linq;

namespace Infrastructure
{
    public static class InfrastructureExtensions
    {
        private const string ApplicationSectionName = "Application";

        public static string GetApplicationName(this IConfiguration configuration)
        {
            var applicationSection = configuration.GetSection(ApplicationSectionName);
            var applicationName = applicationSection?.GetValue<string>("Name");
            if (string.IsNullOrWhiteSpace(applicationName))
                throw new Exception($"{ApplicationSectionName}.Name configuration key is missing.");

            return applicationName;
        }

        public static void AddInfrastructure<TConfiguration>(this IServiceCollection services, IConfiguration configuration, string[] fileSystems = null) where TConfiguration : class
        {
            if (services == null)
                throw new ArgumentNullException(nameof(services));
            if (configuration == null)
                throw new ArgumentNullException(nameof(configuration));

            try
            {
                DateTimeProvider.Configure(new DateTimeProvider.SystemProvider());
                services.TryAddSingleton<IScheduler, Scheduler>();

                services.AddInfrastructureLogging(configuration);

                services.AddFileSystems(configuration, fileSystems);

                services.Configure<TConfiguration>(appSettings => configuration.GetSection("AppSettings").Bind(appSettings));
                WarnConfigurationNotDeclared(services, configuration);

                services.Configure<CacheOptions>(section => configuration.GetSection("CacheOptions").Bind(section));

                AddResources(services);
            }
            catch (Exception e)
            {
                using (var serviceProvider = services.BuildServiceProvider())
                {
                    var logger = serviceProvider.GetRequiredService<ILoggerFactory>().CreateLogger(typeof(InfrastructureExtensions).FullName);
                    logger.LogError(e, e.Message);
                }
                TraceServiceDescriptors(services);
                throw;
            }
        }

        private static void AddResources(IServiceCollection services)
        {
            services.AddSingleton<IResourceRepository, ResourceRepositoryCached>(x =>
            {
                return new ResourceRepositoryCached(
                    new ResourceRepository(
                        x.GetService<IFileSystemFactory>(), x.GetService<ILogger<ResourceRepository>>()
                    ), x.GetService<IOptions<CacheOptions>>(), x.GetService<ILogger<ResourceRepositoryCached>>()
                );
            });
            services.TryAddSingleton<IResourceService, ResourceService>();
        }

        [Conditional("DEBUG")]
        public static void TraceServiceDescriptors(IServiceCollection services)
        {
            using (var serviceProvider = services.BuildServiceProvider())
            {
                var logger = serviceProvider.GetService<ILoggerFactory>().CreateLogger(typeof(InfrastructureExtensions).FullName);
                using (logger.CreateBlockTrace("Dumping ServiceDescriptors"))
                {
                    var serviceDescriptors = services.OrderBy(x => x.ServiceType.FullName).ToList();
                    foreach (var serviceDescriptor in serviceDescriptors)
                        logger.LogTrace($"\tLifetime:{serviceDescriptor.Lifetime + ";",-10}   ServiceType:{serviceDescriptor.ServiceType};   ImplementationType:{serviceDescriptor.ImplementationType};");
                }
            }
        }

        private static void WarnConfigurationNotDeclared(IServiceCollection services, IConfiguration configuration)
        {
            services.WarnFileSystemsConfigurationNotDeclared(configuration);
        }
    }
}