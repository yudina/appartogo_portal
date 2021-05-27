using AppartogoPortal.Core;
using AppartogoPortal.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics;

namespace AppartogoPortal.Controllers
{
    public class HomeController : ControllerBase<HomeController>
    {
        public HomeController(IServiceProvider serviceProvider)
            : base(serviceProvider)
        {
        }

        public IActionResult Index()
        {
            try
            {
                logger.LogDebug("Test logging");
                return View();
            }
            catch (Exception ex)
            {
                return HandleExceptionResponse(ex);
            }
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}