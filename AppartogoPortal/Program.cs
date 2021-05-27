using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using System;

namespace AppartogoPortal
{
    public class Program
    {
        public static void Main(string[] args)
        {
            try
            {
                BuildWebHost(args).Run();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Uncaught exception : {ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }

        public static IWebHost BuildWebHost(string[] args)
        {
            return WebHost.CreateDefaultBuilder(args)
                .UseDefaultServiceProvider(options => options.ValidateScopes = false)
                .UseStartup<Startup>()
                .Build();
        }

    }
}