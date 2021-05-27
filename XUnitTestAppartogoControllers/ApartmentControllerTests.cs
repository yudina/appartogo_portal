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
    public class ApartmentControllerTests
    {
        private readonly Guid _Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e");
        private readonly Guid _Id1 = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e");
        private readonly List<Apartment> _apartments = new List<Apartment>
            {
                new Apartment()
                {
                    Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e"),
                    ApartmentNumber = "5",
                    TenantId = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e"),
                    PropertyId = Guid.NewGuid(),
                    ApartmentType = "moderne",
                    Rooms = 3,
                    Bathrooms = 2,
                    Size = "3",
                    HasWater = true,
                    HasHeater = true,
                    HasParking = true,
                    HasFurniture = true,
                    HasAirconditioner = true,
                    HasCable = true,
                    HasInternet = true,
                    AvailibityDate = DateTime.Now,
                    Archived = false

                },
                new Apartment()
                {
                    Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e"),
                    ApartmentNumber = "5",
                    TenantId = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e"),
                    PropertyId = Guid.NewGuid(),
                    ApartmentType = "moderne",
                    Rooms = 3,
                    Bathrooms = 2,
                    Size = "3",
                    HasWater = true,
                    HasHeater = true,
                    HasParking = true,
                    HasFurniture = true,
                    HasAirconditioner = true,
                    HasCable = true,
                    HasInternet = true,
                    AvailibityDate = DateTime.Now,
                    Archived = false
                }
            };
        [Fact]
        public async Task Get_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            mockRepo.Setup(repo => repo.Apartment.GetAllAsync()).ReturnsAsync(GetTestApartment());
            var controller = new ApartmentController(mockRepo.Object);

            // Act
            var result = await controller.Get();

            // Assert
            var entities = Assert.IsAssignableFrom<IEnumerable<Apartment>>(result);
            Assert.Equal(2, entities.Count());
        }

        [Fact]
        public async Task GetById_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            mockRepo.Setup(repo => repo.Apartment.GetByIdAsync(_Id)).ReturnsAsync(GetTestApartment().FirstOrDefault(
            s => s.Id == _Id));
            var controller = new ApartmentController(mockRepo.Object);

            // Act
            var result = await controller.GetById(_Id);

            // Assert
            var entity = Assert.IsAssignableFrom<Apartment>(result);
            Assert.Equal(_Id, entity.Id);
            //mettre un int dans db?
            Assert.Equal("5",entity.ApartmentNumber);
            Assert.Equal(_Id, entity.TenantId);
            Assert.Equal(_Id, entity.PropertyId);
            Assert.Equal("moderne", entity.ApartmentType);
            Assert.Equal(3,entity.Rooms);
            Assert.Equal(2,entity.Bathrooms);
            Assert.Equal("3",entity.Size);
            Assert.True(entity.HasWater);
            Assert.True(entity.HasHeater);
            Assert.True(entity.HasParking);
            Assert.True(entity.HasFurniture);
            Assert.True(entity.HasAirconditioner);
            Assert.True(entity.HasCable);
            Assert.True(entity.HasInternet);
            Assert.True(DateTime.Now > entity.AvailibityDate);
            Assert.False(entity.Archived);
        }

        [Fact]
        public async Task Add_Returns_correct_data()
        {
            // Arrange
            Apartment test_Apartment = new Apartment()
            {
                Id = _Id,
                ApartmentNumber = "5",
                TenantId = _Id,
                PropertyId = _Id,
                ApartmentType = "moderne",
                Rooms =3,
                Bathrooms = 2,
                Size = "3",
                HasWater = true,
                HasHeater = true,
                HasParking =true,
                HasFurniture =true,
                HasAirconditioner =true,
                HasCable = true,
                HasInternet = true,
                AvailibityDate = DateTime.Now,
                Archived = false

            };
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _apartments.Count;
            mockRepo.Setup(repo => repo.Apartment.AddAsync(test_Apartment)).Callback<Apartment>((x) => { _apartments.Add(x); }).ReturnsAsync(test_Apartment.Id);
            var controller = new ApartmentController(mockRepo.Object);
            
            // Act
            var result = await controller.Add(test_Apartment);

            // Assert
            var entity = Assert.IsAssignableFrom<Guid>(result);
            Assert.Equal(_Id, entity);
            Assert.True(len < _apartments.Count);
        }

        [Fact]
        public void Delete_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _apartments.Count;
            mockRepo.Setup(repo => repo.Apartment.DeleteAsync(_Id)).Callback<Guid>((x) => { _apartments.Remove(_apartments.FirstOrDefault(s => s.Id == x)); });
            var controller = new ApartmentController(mockRepo.Object);

            // Act
            controller.Delete(_Id);

            // Assert
            Assert.True(len > _apartments.Count);
        }

        [Fact]
        public void Update_Returns_correct_data()
        {
            // Arrange
            Apartment test_Apartment = new Apartment()
            {
                Id = _Id,
                ApartmentNumber = "5",
                TenantId = _Id,
                PropertyId = _Id,
                ApartmentType = "moderne",
                Rooms = 3,
                Bathrooms = 2,
                Size = "3",
                HasWater = true,
                HasHeater = true,
                HasParking = true,
                HasFurniture = true,
                HasAirconditioner = true,
                HasCable = true,
                HasInternet = true,
                AvailibityDate = DateTime.Now,
                Archived = false

            };
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _apartments.Count;
            mockRepo.Setup(repo => repo.Apartment.UpdateAsync(test_Apartment)).Callback<Apartment>((x) => { _apartments[_apartments.FindIndex(s => s.Id == x.Id)] = x; });
            var controller = new ApartmentController(mockRepo.Object);

            // Act
            controller.Update(test_Apartment);

            // Assert
            Assert.Equal(len, _apartments.Count);
            Assert.Equal(_apartments.FirstOrDefault(s => s.Id == test_Apartment.Id), test_Apartment);
        }

        #region snippet_GetTestSessions
        private List<Apartment> GetTestApartment()
        {
            var sessions = new List<Apartment>
            {
                new Apartment()
                {
                    Id = _Id,
                    ApartmentNumber = "5",
                    TenantId = _Id,
                    PropertyId = _Id,
                    ApartmentType = "moderne",
                    Rooms = 3,
                    Bathrooms = 2,
                    Size = "3",
                    HasWater = true,
                    HasHeater = true,
                    HasParking = true,
                    HasFurniture = true,
                    HasAirconditioner = true,
                    HasCable = true,
                    HasInternet = true,
                    AvailibityDate = DateTime.Now,
                    Archived = false

                },
                new Apartment()
                {
                    Id = _Id1,
                    ApartmentNumber = "5",
                    TenantId = _Id,
                    PropertyId = _Id,
                    ApartmentType = "moderne",
                    Rooms = 3,
                    Bathrooms = 2,
                    Size = "3",
                    HasWater = true,
                    HasHeater = true,
                    HasParking = true,
                    HasFurniture = true,
                    HasAirconditioner = true,
                    HasCable = true,
                    HasInternet = true,
                    AvailibityDate = DateTime.Now,
                    Archived = false
                }
            };
            return sessions;
        }
        #endregion
    }
}
