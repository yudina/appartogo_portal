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
    public class AccountControllerTests
    {
        private readonly Guid _Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e");
        private readonly Guid _Id1 = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e");
        private readonly List<Account> _accounts = new List<Account>
            {
                new Account()
                {
                    Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e"),
                    AddressId = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e"),
                    Email = "test1@gmail.com",
                    FirstName = "jean",
                    LastName = "michel",
                    PhoneNumber = "5145145140",
                    ProfilePictureUrl = "test"

                },
                new Account()
                {
                    Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e"),
                    AddressId = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e"),
                    Email = "test1@gmail.com",
                    FirstName = "jeanne",
                    LastName = "michele",
                    PhoneNumber = "5145245140",
                    ProfilePictureUrl = "test"
                }
            };

        [Fact]
        public async Task Get_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            mockRepo.Setup(repo => repo.Account.GetAllAsync()).ReturnsAsync(GetTestAccount());
            var controller = new AccountController(mockRepo.Object);

            // Act
            var result = await controller.Get();

            // Assert
            var entities = Assert.IsAssignableFrom<IEnumerable<Account>>(result);
            Assert.Equal(2, entities.Count());
        }

        [Fact]
        public async Task GetById_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            mockRepo.Setup(repo => repo.Account.GetByIdAsync(_Id)).ReturnsAsync(GetTestAccount().FirstOrDefault(
            s => s.Id == _Id));
            var controller = new AccountController(mockRepo.Object);

            // Act
            var result = await controller.GetById(_Id);

            // Assert
            var entity = Assert.IsAssignableFrom<Account>(result);
            Assert.Equal(_Id, entity.Id);
            Assert.Equal(_Id1, entity.AddressId);
            Assert.Equal("test1@gmail.com", entity.Email);
            Assert.Equal("jean", entity.FirstName);
            Assert.Equal("michel", entity.LastName);
            Assert.Equal("5145145140", entity.PhoneNumber);
            Assert.Equal("test", entity.ProfilePictureUrl);
        }

        [Fact]
        public async Task Add_Returns_correct_data()
        {
            // Arrange
            Account test_Account = new Account()
            {
                Id = _Id,
                AddressId = _Id1,
                Email = "test1@gmail.com",
                FirstName = "jean",
                LastName = "michel",
                PhoneNumber = "5145145140",
                ProfilePictureUrl = "test"
            };
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _accounts.Count;
            mockRepo.Setup(repo => repo.Account.AddAsync(test_Account)).Callback<Account>((x) => { _accounts.Add(x); }).ReturnsAsync(test_Account.Id);
            var controller = new AccountController(mockRepo.Object);
            
            // Act
            var result = await controller.Add(test_Account);

            // Assert
            var entity = Assert.IsAssignableFrom<Guid>(result);
            Assert.Equal(_Id, entity);
            Assert.True(len < _accounts.Count);
        }

        [Fact]
        public void Delete_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _accounts.Count;
            mockRepo.Setup(repo => repo.Account.DeleteAsync(_Id)).Callback<Guid>((x) => { _accounts.Remove(_accounts.FirstOrDefault(s => s.Id == x)); });
            var controller = new AccountController(mockRepo.Object);

            // Act
            controller.Delete(_Id);

            // Assert
            Assert.True(len > _accounts.Count);
        }

        [Fact]
        public void Update_Returns_correct_data()
        {
            // Arrange
            Account test_Account = new Account()
            {
                Id = _Id,
                AddressId = _Id1,
                Email = "test1@gmail.com",
                FirstName = "marie",
                LastName = "michel",
                PhoneNumber = "5145145140",
                ProfilePictureUrl = "test"
            };
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _accounts.Count;
            mockRepo.Setup(repo => repo.Account.UpdateAsync(test_Account)).Callback<Account>((x) => { _accounts[_accounts.FindIndex(s => s.Id == x.Id)]=x; });
            var controller = new AccountController(mockRepo.Object);

            // Act
            controller.Update(test_Account);

            // Assert
            Assert.Equal(len, _accounts.Count);
            Assert.Equal(_accounts.FirstOrDefault(s => s.Id == test_Account.Id), test_Account);
        }

        #region snippet_GetTestSessions
        private List<Account> GetTestAccount()
        {
            var sessions = new List<Account>
            {
                new Account()
                {
                    Id = _Id,
                    AddressId = _Id1,
                    Email = "test1@gmail.com",
                    FirstName = "jean",
                    LastName = "michel",
                    PhoneNumber = "5145145140",
                    ProfilePictureUrl = "test"

                },
                new Account()
                {
                    Id = _Id1,
                    AddressId = _Id,
                    Email = "test1@gmail.com",
                    FirstName = "jeanne",
                    LastName = "michele",
                    PhoneNumber = "5145245140",
                    ProfilePictureUrl = "test"
                }
            };
            return sessions;
        }
        #endregion
    }
}
