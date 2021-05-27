using AppartogoPortal.Api.Models;
using AppartogoPortal.Core;
using Infrastructure.Exceptions;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AppartogoApiClient;

namespace AppartogoWeb.Api.Controllers
{
    [Route("api/[controller]")]
    public class TestsController : ControllerBase<TestsController>
    {
        private static List<Test> tests = new List<Test>(); //Global in-memory collection for DEMO purpose only :)

        public TestsController(IServiceProvider serviceProvider)
            : base(serviceProvider)
        {
        }

        public async Task<IActionResult> Get()
        {
            try
            {
                //Logic here to retreive data....
                await Task.CompletedTask;

                return Json(ApiResponse<List<Test>>.SuccessResponse(tests));
            }
            catch (Exception ex)
            {
                return HandleExceptionResponse(ex);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] Test test)
        {
            try
            {
                if (test == null)
                    throw new BadRequestException("Invalid parameters");
                if (string.IsNullOrEmpty(test.Name))
                    throw new BadRequestException("Invalid parameter Name");

                if (tests.FirstOrDefault(t => t.Name == test.Name) != null)
                    throw new BadRequestException("Test already exists");

                //Logic here to insert data....
                test.Id = Guid.NewGuid().ToString("N");
                tests.Add(test);
                await Task.CompletedTask;

                return Json(ApiResponse<string>.SuccessResponse(test.Id));
            }
            catch (Exception ex)
            {
                return HandleExceptionResponse(ex);
            }
        }
    }
}