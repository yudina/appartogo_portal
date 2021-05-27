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
    public class ListingControllerTests
    {
        private readonly Guid _Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e");
        private readonly Guid _Id1 = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e");
        private readonly List<Listing> _listings = new List<Listing>
            {
                new Listing()
                {
                    Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e"),
                    ApartmentId = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e"),
                    Titre = "",
                    Description = "",
                    Rent = 500,
                    PostedDateTime = DateTime.Now,
                    Archived = false

                },
                new Listing()
                {
                    Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e"),
                    ApartmentId = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e"),
                    Titre = "",
                    Description = "",
                    Rent = 500,
                    PostedDateTime = DateTime.Now,
                    Archived = false
                }
            };
        [Fact]
        public async Task Get_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            mockRepo.Setup(repo => repo.Listing.GetAllAsync()).ReturnsAsync(GetTestListing());
            var controller = new ListingController(mockRepo.Object);

            // Act
            var result = await controller.Get();

            // Assert
            var entities = Assert.IsAssignableFrom<IEnumerable<Listing>>(result);
            Assert.Equal(2, entities.Count());
        }

        [Fact]
        public async Task GetById_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            mockRepo.Setup(repo => repo.Listing.GetByIdAsync(_Id)).ReturnsAsync(GetTestListing().FirstOrDefault(
            s => s.Id == _Id));
            var controller = new ListingController(mockRepo.Object);

            // Act
            var result = await controller.GetById(_Id);

            // Assert
            var entity = Assert.IsAssignableFrom<Listing>(result);
            Assert.Equal(_Id, entity.Id);
            Assert.Equal(_Id1, entity.ApartmentId);
            Assert.Equal("", entity.Titre);
            Assert.Equal("", entity.Description);
            Assert.Equal(500, entity.Rent);
            Assert.True(DateTime.Now > entity.PostedDateTime);
            Assert.False(entity.Archived);
        }

        [Fact]
        public async Task Add_Returns_correct_data()
        {
            // Arrange
            Listing test_Listing = new Listing()
            {
                Id = _Id,
                ApartmentId = Guid.NewGuid(),
                Titre = "",
                Description = "",
                Rent = 500,
                PostedDateTime = DateTime.Now,
                Archived = false

            };
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _listings.Count;
            mockRepo.Setup(repo => repo.Listing.AddAsync(test_Listing)).Callback<Listing>((x) => { _listings.Add(x); }).ReturnsAsync(test_Listing.Id);
            var controller = new ListingController(mockRepo.Object);
            
            // Act
            var result = await controller.Add(test_Listing);

            // Assert
            var entity = Assert.IsAssignableFrom<Guid>(result);
            Assert.Equal(_Id, entity);
            Assert.True(len < _listings.Count);
        }

        [Fact]
        public void Delete_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _listings.Count;
            mockRepo.Setup(repo => repo.Listing.DeleteAsync(_Id)).Callback<Guid>((x) => { _listings.Remove(_listings.FirstOrDefault(s => s.Id == x)); });
            var controller = new ListingController(mockRepo.Object);

            // Act
            controller.Delete(_Id);

            // Assert
            Assert.True(len > _listings.Count);
        }

        [Fact]
        public void Update_Returns_correct_data()
        {
            // Arrange
            Listing test_Listing = new Listing()
            {
                Id = _Id,
                ApartmentId = Guid.NewGuid(),
                Titre = "",
                Description = "",
                Rent = 500,
                PostedDateTime = DateTime.Now,
                Archived = false

            };
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _listings.Count;
            mockRepo.Setup(repo => repo.Listing.UpdateAsync(test_Listing)).Callback<Listing>((x) => { _listings[_listings.FindIndex(s => s.Id == x.Id)] = x; });
            var controller = new ListingController(mockRepo.Object);

            // Act
            controller.Update(test_Listing);

            // Assert
            Assert.Equal(len, _listings.Count);
            Assert.Equal(_listings.FirstOrDefault(s => s.Id == test_Listing.Id), test_Listing);
        }

        #region snippet_GetTestSessions
        private List<Listing> GetTestListing()
        {
            var sessions = new List<Listing>
            {
                new Listing()
                {
                    Id = _Id,
                    ApartmentId = _Id1,
                    Titre = "",
                    Description = "",
                    Rent = 500,
                    PostedDateTime = DateTime.Now,
                    Archived = false

                },
                new Listing()
                {
                    Id = _Id1,
                    ApartmentId = _Id,
                    Titre = "",
                    Description = "",
                    Rent = 500,
                    PostedDateTime = DateTime.Now,
                    Archived = false
                }
            };
            return sessions;
        }
        #endregion
    }
}
