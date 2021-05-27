using System;
using Xunit;
using Moq;
using Appartogo.Core.DAL.Interfaces;
using Appartogo.Core.DAL.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using AppartogoPortal.Controllers;
using System.Linq;

namespace XUnitTestAppartogoControllers
{
    public class ApplicationControllerTests
    {
        private readonly Guid _Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e");
        private readonly Guid _Id1 = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e");
        private readonly List<Application> _applications = new List<Application>
            {
                new Application()
                {
                    Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e"),
                    AccountId = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e"),
                    ListingId = Guid.NewGuid(),
                    ConsentForCreditCheck = true,
                    WantsRentalInsurance = true,
                    Status = 1,
                    ApplicationDate = DateTime.Now

                },
                new Application()
                {
                    Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e"),
                    AccountId = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e"),
                    ListingId = Guid.NewGuid(),
                    ConsentForCreditCheck = true,
                    WantsRentalInsurance = true,
                    Status = 1,
                    ApplicationDate = DateTime.Now
                }
            };
        [Fact]
        public async Task Get_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            mockRepo.Setup(repo => repo.Application.GetAllAsync()).ReturnsAsync(GetTestApplication());
            var controller = new ApplicationController(mockRepo.Object);

            // Act
            var result = await controller.Get();

            // Assert
            var entities = Assert.IsAssignableFrom<IEnumerable<Application>>(result);
            Assert.Equal(2, entities.Count());
        }

        [Fact]
        public async Task GetById_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            mockRepo.Setup(repo => repo.Application.GetByIdAsync(_Id)).ReturnsAsync(GetTestApplication().FirstOrDefault(
            s => s.Id == _Id));
            var controller = new ApplicationController(mockRepo.Object);

            // Act
            var result = await controller.GetById(_Id);

            // Assert
            var entity = Assert.IsAssignableFrom<Application>(result);
            Assert.Equal(_Id, entity.Id);
            Assert.Equal(_Id, entity.AccountId);
            Assert.Equal(_Id1, entity.ListingId);
            Assert.True(entity.ConsentForCreditCheck);
            Assert.True(entity.WantsRentalInsurance);
            Assert.Equal(1, entity.Status);
            Assert.True(DateTime.Now > entity.ApplicationDate);
        }

        [Fact]
        public async Task Add_Returns_correct_data()
        {
            // Arrange
            Application test_Application = new Application()
            {
                Id = _Id,
                AccountId = _Id,
                ListingId = _Id1,
                ConsentForCreditCheck = true,
                WantsRentalInsurance = true,
                Status = 1,
                ApplicationDate = DateTime.Now

            };
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _applications.Count;
            mockRepo.Setup(repo => repo.Application.AddAsync(test_Application)).Callback<Application>((x) => { _applications.Add(x); }).ReturnsAsync(test_Application.Id);
            var controller = new ApplicationController(mockRepo.Object);
            
            // Act
            var result = await controller.Add(test_Application);

            // Assert
            var entity = Assert.IsAssignableFrom<Guid>(result);
            Assert.Equal(_Id, entity);
            Assert.True(len < _applications.Count);
        }

        [Fact]
        public void Delete_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _applications.Count;
            mockRepo.Setup(repo => repo.Application.DeleteAsync(_Id)).Callback<Guid>((x) => { _applications.Remove(_applications.FirstOrDefault(s => s.Id == x)); });
            var controller = new ApplicationController(mockRepo.Object);

            // Act
            controller.Delete(_Id);

            // Assert
            Assert.True(len > _applications.Count);
        }

        [Fact]
        public void Update_Returns_correct_data()
        {
            // Arrange
            Application test_Application = new Application()
            {
                Id = _Id,
                AccountId = _Id,
                ListingId = _Id1,
                ConsentForCreditCheck = true,
                WantsRentalInsurance = true,
                Status = 1,
                ApplicationDate = DateTime.Now

            };
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _applications.Count;
            mockRepo.Setup(repo => repo.Application.UpdateAsync(test_Application)).Callback<Application>((x) => { _applications[_applications.FindIndex(s => s.Id == x.Id)] = x; });
            var controller = new ApplicationController(mockRepo.Object);

            // Act
            controller.Update(test_Application);

            // Assert
            Assert.Equal(len, _applications.Count);
            Assert.Equal(_applications.FirstOrDefault(s => s.Id == test_Application.Id), test_Application);
        }

        #region snippet_GetTestSessions
        private List<Application> GetTestApplication()
        {
            var sessions = new List<Application>
            {
                new Application()
                {
                    Id = _Id,
                    AccountId = _Id,
                    ListingId = _Id1,
                    ConsentForCreditCheck = true,
                    WantsRentalInsurance = true,
                    Status = 1,
                    ApplicationDate = DateTime.Now

                },
                new Application()
                {
                    Id = _Id1,
                    AccountId = _Id,
                    ListingId = _Id1,
                    ConsentForCreditCheck = true,
                    WantsRentalInsurance = true,
                    Status = 1,
                    ApplicationDate = DateTime.Now
                }
            };
            return sessions;
        }
        #endregion
    }
}
