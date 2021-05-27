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
    public class TenantControllerTests
    {
        private readonly Guid _Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e");
        private readonly Guid _Id1 = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e");
        private readonly List<Tenant> _tenants = new List<Tenant>
            {
                new Tenant()
                {
                    Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e"),
                    AccountId = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e"),
                    ActiveLease = true,
                    CreditScore = 10,
                    RentalInsuranceNumber = "test"

                },
                new Tenant()
                {
                    Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e"),
                    AccountId = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e"),
                    ActiveLease = true,
                    CreditScore = 10,
                    RentalInsuranceNumber = "test"
                }
            };

        [Fact]
        public async Task Get_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            mockRepo.Setup(repo => repo.Tenant.GetAllAsync()).ReturnsAsync(GetTestTenant());
            var controller = new TenantController(mockRepo.Object);

            // Act
            var result = await controller.Get();

            // Assert
            var entities = Assert.IsAssignableFrom<IEnumerable<Tenant>>(result);
            Assert.Equal(2, entities.Count());
        }

        [Fact]
        public async Task GetById_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            mockRepo.Setup(repo => repo.Tenant.GetByIdAsync(_Id)).ReturnsAsync(GetTestTenant().FirstOrDefault(
            s => s.Id == _Id));
            var controller = new TenantController(mockRepo.Object);

            // Act
            var result = await controller.GetById(_Id);

            // Assert
            var entity = Assert.IsAssignableFrom<Tenant>(result);
            Assert.Equal(_Id, entity.Id);
            Assert.Equal(_Id1, entity.AccountId);
            Assert.True(entity.ActiveLease);
            Assert.Equal(10, entity.CreditScore);
            Assert.Equal("test", entity.RentalInsuranceNumber);
        }

        [Fact]
        public async Task Add_Returns_correct_data()
        {
            // Arrange
            Tenant test_Tenant = new Tenant()
            {
                Id = _Id,
                AccountId = _Id1,
                ActiveLease = true,
                CreditScore = 10,
                RentalInsuranceNumber = "test"

            };
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _tenants.Count;
            mockRepo.Setup(repo => repo.Tenant.AddAsync(test_Tenant)).Callback<Tenant>((x) => { _tenants.Add(x); }).ReturnsAsync(test_Tenant.Id);
            var controller = new TenantController(mockRepo.Object);
            
            // Act
            var result = await controller.Add(test_Tenant);

            // Assert
            var entity = Assert.IsAssignableFrom<Guid>(result);
            Assert.Equal(_Id, entity);
            Assert.True(len < _tenants.Count);
        }

        [Fact]
        public void Delete_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _tenants.Count;
            mockRepo.Setup(repo => repo.Tenant.DeleteAsync(_Id)).Callback<Guid>((x) => { _tenants.Remove(_tenants.FirstOrDefault(s => s.Id == x)); });
            var controller = new TenantController(mockRepo.Object);

            // Act
            controller.Delete(_Id);

            // Assert
            Assert.True(len > _tenants.Count);
        }

        [Fact]
        public void Update_Returns_correct_data()
        {
            // Arrange
            Tenant test_Tenant = new Tenant()
            {
                Id = _Id,
                AccountId = _Id1,
                ActiveLease = true,
                CreditScore = 10,
                RentalInsuranceNumber = "test"

            };
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _tenants.Count;
            mockRepo.Setup(repo => repo.Tenant.UpdateAsync(test_Tenant)).Callback<Tenant>((x) => { _tenants[_tenants.FindIndex(s => s.Id == x.Id)] = x; });
            var controller = new TenantController(mockRepo.Object);

            // Act
            controller.Update(test_Tenant);

            // Assert
            Assert.Equal(len, _tenants.Count);
            Assert.Equal(_tenants.FirstOrDefault(s => s.Id == test_Tenant.Id), test_Tenant);
        }

        #region snippet_GetTestSessions
        private List<Tenant> GetTestTenant()
        {
            var sessions = new List<Tenant>
            {
                new Tenant()
                {
                    Id = _Id,
                    AccountId = _Id1,
                    ActiveLease = true,
                    CreditScore = 10,
                    RentalInsuranceNumber = "test"

                },
                new Tenant()
                {
                    Id = _Id1,
                    AccountId = _Id,
                    ActiveLease = true,
                    CreditScore = 10,
                    RentalInsuranceNumber = "test"
                }
            };
            return sessions;
        }
        #endregion
    }
}
