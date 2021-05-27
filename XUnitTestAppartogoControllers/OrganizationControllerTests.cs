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
    public class OrganizationControllerTests
    {
        private readonly Guid _Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e");
        private readonly Guid _Id1 = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e");
        private readonly List<Organization> _organizations = new List<Organization>
            {
                new Organization()
                {
                    Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e"),
                    AddressId = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e"),
                    Name = "test"

                },
                new Organization()
                {
                    Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e"),
                    AddressId = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e"),
                    Name = "test"
                }
            };
        [Fact]
        public async Task Get_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            mockRepo.Setup(repo => repo.Organization.GetAllAsync()).ReturnsAsync(GetTestOrganization());
            var controller = new OrganizationController(mockRepo.Object);

            // Act
            var result = await controller.Get();

            // Assert
            var entities = Assert.IsAssignableFrom<IEnumerable<Organization>>(result);
            Assert.Equal(2, entities.Count());
        }

        [Fact]
        public async Task GetById_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            mockRepo.Setup(repo => repo.Organization.GetByIdAsync(_Id)).ReturnsAsync(GetTestOrganization().FirstOrDefault(
            s => s.Id == _Id));
            var controller = new OrganizationController(mockRepo.Object);

            // Act
            var result = await controller.GetById(_Id);

            // Assert
            var entity = Assert.IsAssignableFrom<Organization>(result);
            Assert.Equal(_Id, entity.Id);
            Assert.Equal(_Id1, entity.AddressId);
            Assert.Equal("test", entity.Name);
        }

        [Fact]
        public async Task Add_Returns_correct_data()
        {
            // Arrange
            Organization test_Organization = new Organization()
            {
                Id = _Id,
                AddressId = _Id1,
                Name = "test"

            };
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _organizations.Count;
            mockRepo.Setup(repo => repo.Organization.AddAsync(test_Organization)).Callback<Organization>((x) => { _organizations.Add(x); }).ReturnsAsync(test_Organization.Id);
            var controller = new OrganizationController(mockRepo.Object);
            
            // Act
            var result = await controller.Add(test_Organization);

            // Assert
            var entity = Assert.IsAssignableFrom<Guid>(result);
            Assert.Equal(_Id, entity);
            Assert.True(len < _organizations.Count);
        }

        [Fact]
        public void Delete_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _organizations.Count;
            mockRepo.Setup(repo => repo.Organization.DeleteAsync(_Id)).Callback<Guid>((x) => { _organizations.Remove(_organizations.FirstOrDefault(s => s.Id == x)); });
            var controller = new OrganizationController(mockRepo.Object);

            // Act
            controller.Delete(_Id);

            // Assert
            mockRepo.Verify();
            Assert.True(len > _organizations.Count);
        }

        [Fact]
        public void Update_Returns_correct_data()
        {
            // Arrange
            Organization test_Organization = new Organization()
            {
                Id = _Id,
                AddressId = _Id1,
                Name = "test"

            };
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _organizations.Count;
            mockRepo.Setup(repo => repo.Organization.UpdateAsync(test_Organization)).Callback<Organization>((x) => { _organizations[_organizations.FindIndex(s => s.Id == x.Id)] = x; });
            var controller = new OrganizationController(mockRepo.Object);

            // Act
            controller.Update(test_Organization);

            // Assert
            Assert.Equal(len, _organizations.Count);
            Assert.Equal(_organizations.FirstOrDefault(s => s.Id == test_Organization.Id), test_Organization);
        }

        #region snippet_GetTestSessions
        private List<Organization> GetTestOrganization()
        {
            var sessions = new List<Organization>
            {
                new Organization()
                {
                    Id = _Id,
                    AddressId = _Id1,
                    Name = "test"

                },
                new Organization()
                {
                    Id = _Id1,
                    AddressId = _Id,
                    Name = "test"
                }
            };
            return sessions;
        }
        #endregion
    }
}
