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
    public class PropertyControllerTests
    {
        private readonly Guid _Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e");
        private readonly Guid _Id1 = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e");
        private readonly List<Property> _properties = new List<Property>
            {
                new Property()
                {
                    Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e"),
                    AddressId = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e"),
                    OrganizationId = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea88e"),
                    ApartmentCount = 52,
                    CanSmoke = true,
                    AnimalsFriendly = true,
                    Archived = false

                },
                new Property()
                {
                    Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e"),
                    AddressId = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e"),
                    OrganizationId = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea89e"),
                    ApartmentCount = 52,
                    CanSmoke = true,
                    AnimalsFriendly = true,
                    Archived = false
                }
            };
        [Fact]
        public async Task Get_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            mockRepo.Setup(repo => repo.Property.GetAllAsync()).ReturnsAsync(GetTestProperty());
            var controller = new PropertyController(mockRepo.Object);

            // Act
            var result = await controller.Get();

            // Assert
            var entities = Assert.IsAssignableFrom<IEnumerable<Property>>(result);
            Assert.Equal(2, entities.Count());
        }

        [Fact]
        public async Task GetById_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            mockRepo.Setup(repo => repo.Property.GetByIdAsync(_Id)).ReturnsAsync(GetTestProperty().FirstOrDefault(
            s => s.Id == _Id));
            var controller = new PropertyController(mockRepo.Object);

            // Act
            var result = await controller.GetById(_Id);

            // Assert
            var entity = Assert.IsAssignableFrom<Property>(result);
            Assert.Equal(_Id, entity.Id);
            Assert.Equal(_Id1, entity.AddressId);
            Assert.Equal(Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea88e"), entity.OrganizationId);
            Assert.Equal(52, entity.ApartmentCount);
            Assert.True(entity.CanSmoke);
            Assert.True(entity.AnimalsFriendly);
            Assert.False(entity.Archived);

        }

        [Fact]
        public async Task Add_Returns_correct_data()
        {
            // Arrange
            Property test_Property = new Property()
            {
                 Id = _Id,
                 AddressId = _Id1,
                 OrganizationId   = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea88e"),
                 ApartmentCount  = 52,
                 CanSmoke      = true,
                 AnimalsFriendly = true,
                 Archived = false

            };
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _properties.Count;
            mockRepo.Setup(repo => repo.Property.AddAsync(test_Property)).Callback<Property>((x) => { _properties.Add(x); }).ReturnsAsync(test_Property.Id);
            var controller = new PropertyController(mockRepo.Object);
            
            // Act
            var result = await controller.Add(test_Property);

            // Assert
            var entity = Assert.IsAssignableFrom<Guid>(result);
            Assert.Equal(_Id, entity);
            Assert.True(len < _properties.Count);
        }

        [Fact]
        public void Delete_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _properties.Count;
            mockRepo.Setup(repo => repo.Property.DeleteAsync(_Id)).Callback<Guid>((x) => { _properties.Remove(_properties.FirstOrDefault(s => s.Id == x)); });
            var controller = new PropertyController(mockRepo.Object);

            // Act
            controller.Delete(_Id);

            // Assert
            Assert.True(len > _properties.Count);
        }

        [Fact]
        public void Update_Returns_correct_data()
        {
            // Arrange
            Property test_Property = new Property()
            {
                Id = _Id,
                AddressId = _Id1,
                OrganizationId = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea88e"),
                ApartmentCount = 52,
                CanSmoke = true,
                AnimalsFriendly = true,
                Archived = false

            };
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _properties.Count;
            mockRepo.Setup(repo => repo.Property.UpdateAsync(test_Property)).Callback<Property>((x) => { _properties[_properties.FindIndex(s => s.Id == x.Id)] = x; });
            var controller = new PropertyController(mockRepo.Object);

            // Act
            controller.Update(test_Property);

            // Assert
            Assert.Equal(len, _properties.Count);
            Assert.Equal(_properties.FirstOrDefault(s => s.Id == test_Property.Id), test_Property);
        }

        #region snippet_GetTestSessions
        private List<Property> GetTestProperty()
        {
            var sessions = new List<Property>
            {
                new Property()
                {
                    Id = _Id,
                    AddressId = _Id1,
                    OrganizationId  = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea88e"),
                    ApartmentCount = 52,
                    CanSmoke = true,
                    AnimalsFriendly = true,
                    Archived = false

                },
                new Property()
                {
                    Id = _Id1,
                    AddressId = _Id,
                    OrganizationId = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea89e"),
                    ApartmentCount = 52,
                    CanSmoke = true,
                    AnimalsFriendly = true,
                    Archived = false
                }
            };
            return sessions;
        }
        #endregion
    }
}
