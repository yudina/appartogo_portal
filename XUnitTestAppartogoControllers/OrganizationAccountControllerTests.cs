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
    public class OrganizationAccountControllerTests
    {
        private readonly Guid _Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e");
        private readonly Guid _Id1 = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e");
        private readonly List<OrganizationAccount> _organizationAccounts = new List<OrganizationAccount>
            {
                new OrganizationAccount()
                {
                    Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e"),
                    AccountId = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e"),
                    OrganizationId = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea88e")

                },
                new OrganizationAccount()
                {
                    Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e"),
                    AccountId = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e"),
                    OrganizationId = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea89e")
                }
            };
        [Fact]
        public async Task Get_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            mockRepo.Setup(repo => repo.OrganizationAccount.GetAllAsync()).ReturnsAsync(GetTestOrganizationAccount());
            var controller = new OrganizationAccountController(mockRepo.Object);

            // Act
            var result = await controller.Get();

            // Assert
            var entities = Assert.IsAssignableFrom<IEnumerable<OrganizationAccount>>(result);
            Assert.Equal(2, entities.Count());
        }

        [Fact]
        public async Task GetById_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            mockRepo.Setup(repo => repo.OrganizationAccount.GetByIdAsync(_Id)).ReturnsAsync(GetTestOrganizationAccount().FirstOrDefault(
            s => s.Id == _Id));
            var controller = new OrganizationAccountController(mockRepo.Object);

            // Act
            var result = await controller.GetById(_Id);

            // Assert
            var entity = Assert.IsAssignableFrom<OrganizationAccount>(result);
            Assert.Equal(_Id, entity.Id);
            Assert.Equal(_Id1, entity.AccountId);
            Assert.Equal(Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea88e"), entity.OrganizationId);
        }

        [Fact]
        public async Task Add_Returns_correct_data()
        {
            // Arrange
            OrganizationAccount test_OrganizationAccount = new OrganizationAccount()
            {
                Id = _Id,
                AccountId = _Id,
                OrganizationId = _Id

            };
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _organizationAccounts.Count;
            mockRepo.Setup(repo => repo.OrganizationAccount.AddAsync(test_OrganizationAccount)).Callback<OrganizationAccount>((x) => { _organizationAccounts.Add(x); }).ReturnsAsync(test_OrganizationAccount.Id);
            var controller = new OrganizationAccountController(mockRepo.Object);
            
            // Act
            var result = await controller.Add(test_OrganizationAccount);

            // Assert
            var entity = Assert.IsAssignableFrom<Guid>(result);
            Assert.Equal(_Id, entity);
            Assert.True(len < _organizationAccounts.Count);
        }

        [Fact]
        public void Delete_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _organizationAccounts.Count;
            mockRepo.Setup(repo => repo.OrganizationAccount.DeleteAsync(_Id)).Callback<Guid>((x) => { _organizationAccounts.Remove(_organizationAccounts.FirstOrDefault(s => s.Id == x)); });
            var controller = new OrganizationAccountController(mockRepo.Object);

            // Act
            controller.Delete(_Id);

            // Assert
            Assert.True(len > _organizationAccounts.Count);
        }

        [Fact]
        public void Update_Returns_correct_data()
        {
            // Arrange
            OrganizationAccount test_OrganizationAccount = new OrganizationAccount()
            {
                Id = _Id,
                AccountId = _Id1,
                OrganizationId = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea88e")

            };
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _organizationAccounts.Count;
            mockRepo.Setup(repo => repo.OrganizationAccount.UpdateAsync(test_OrganizationAccount)).Callback<OrganizationAccount>((x) => { _organizationAccounts[_organizationAccounts.FindIndex(s => s.Id == x.Id)] = x; });
            var controller = new OrganizationAccountController(mockRepo.Object);

            // Act
            controller.Update(test_OrganizationAccount);

            // Assert
            Assert.Equal(len, _organizationAccounts.Count);
            Assert.Equal(_organizationAccounts.FirstOrDefault(s => s.Id == test_OrganizationAccount.Id), test_OrganizationAccount);
        }

        #region snippet_GetTestSessions
        private List<OrganizationAccount> GetTestOrganizationAccount()
        {
            var sessions = new List<OrganizationAccount>
            {
                new OrganizationAccount()
                {
                    Id = _Id,
                    AccountId = _Id1,
                    OrganizationId = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea88e")

                },
                new OrganizationAccount()
                {
                    Id = _Id1,
                    AccountId = _Id,
                    OrganizationId = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea89e")
                }
            };
            return sessions;
        }
        #endregion
    }
}
