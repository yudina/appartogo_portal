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
    public class AddressControllerTests
    {
        private readonly Guid _Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e");
        private readonly Guid _Id1 = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e");
        private readonly List<Address> _addresses = new List<Address>
            {
                new Address()
                {
                    Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e"),
                    CivicNumber = "5560",
                    StreetName = "test",
                    City = "Montreal",
                    PostalCode = "H3Y 1X5",
                    Country = "Canada",
                    State = "QC",
                    ApartmentNumber = "1"

                },
                new Address()
                {
                    Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e"),
                    CivicNumber = "5540",
                    StreetName = "testtest",
                    City = "Montreal",
                    PostalCode = "H3A 1X5",
                    Country = "Canada",
                    State = "ON",
                    ApartmentNumber = "5"
                }
            };
        [Fact]
        public async Task Get_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            mockRepo.Setup(repo => repo.Address.GetAllAsync()).ReturnsAsync(GetTestAdress());
            var controller = new AddressController(mockRepo.Object);

            // Act
            var result = await controller.Get();

            // Assert
            var entities = Assert.IsAssignableFrom<IEnumerable<Address>>(result);
            Assert.Equal(2, entities.Count());
        }

        [Fact]
        public async Task GetById_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            mockRepo.Setup(repo => repo.Address.GetByIdAsync(_Id)).ReturnsAsync(GetTestAdress().FirstOrDefault(
            s => s.Id == _Id));
            var controller = new AddressController(mockRepo.Object);

            // Act
            var result = await controller.GetById(_Id);

            // Assert
            var entity = Assert.IsAssignableFrom<Address>(result);
            Assert.Equal(_Id, entity.Id);
            Assert.Equal("5560", entity.CivicNumber);
            Assert.Equal("test", entity.StreetName);
            Assert.Equal("Montreal", entity.City);
            Assert.Equal("H3Y 1X5", entity.PostalCode);
            Assert.Equal("Canada", entity.Country);
            Assert.Equal("QC", entity.State);
            Assert.Equal("1", entity.ApartmentNumber);
        }

        [Fact]
        public async Task Add_Returns_correct_data()
        {
            // Arrange
            Address test_address = new Address()
            {
                Id = _Id,
                CivicNumber = "5560",
                StreetName = "test",
                City = "Montreal",
                PostalCode = "H3Y 1X5",
                Country = "Canada",
                State = "QC",
                ApartmentNumber = "1"

            };
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _addresses.Count;
            mockRepo.Setup(repo => repo.Address.AddAsync(test_address)).Callback<Address>((x) => { _addresses.Add(x); }).ReturnsAsync(test_address.Id);
            var controller = new AddressController(mockRepo.Object);
            
            // Act
            var result = await controller.Add(test_address);

            // Assert
            var entity = Assert.IsAssignableFrom<Guid>(result);
            Assert.Equal(_Id, entity);
            Assert.True(len < _addresses.Count);
        }

        [Fact]
        public void Delete_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _addresses.Count;
            mockRepo.Setup(repo => repo.Address.DeleteAsync(_Id)).Callback<Guid>((x) => { _addresses.Remove(_addresses.FirstOrDefault(s => s.Id == x)); });
            var controller = new AddressController(mockRepo.Object);

            // Act
            controller.Delete(_Id);

            // Assert
            Assert.True(len > _addresses.Count);
        }

        [Fact]
        public void Update_Returns_correct_data()
        {
            // Arrange
            Address test_address = new Address()
            {
                Id = _Id,
                CivicNumber = "5560",
                StreetName = "test",
                City = "Montreal",
                PostalCode = "H3Y 1X5",
                Country = "Canada",
                State = "QC",
                ApartmentNumber = "1"

            };
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _addresses.Count;
            mockRepo.Setup(repo => repo.Address.UpdateAsync(test_address)).Callback<Address>((x) => { _addresses[_addresses.FindIndex(s => s.Id == x.Id)] = x; });
            var controller = new AddressController(mockRepo.Object);

            // Act
            controller.Update(test_address);

            // Assert
            Assert.Equal(len, _addresses.Count);
            Assert.Equal(_addresses.FirstOrDefault(s => s.Id == test_address.Id), test_address);
        }

        #region snippet_GetTestSessions
        private List<Address> GetTestAdress()
        {
            var sessions = new List<Address>
            {
                new Address()
                {
                    Id = _Id,
                    CivicNumber = "5560",
                    StreetName = "test",
                    City = "Montreal",
                    PostalCode = "H3Y 1X5",
                    Country = "Canada",
                    State = "QC",
                    ApartmentNumber = "1"

                },
                new Address()
                {
                    Id = _Id1,
                    CivicNumber = "5540",
                    StreetName = "testtest",
                    City = "Montreal",
                    PostalCode = "H3A 1X5",
                    Country = "Canada",
                    State = "ON",
                    ApartmentNumber = "5"
                }
            };
            return sessions;
        }
        #endregion
    }
}
