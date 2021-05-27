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
    public class AttachmentControllerTests
    {
        private readonly Guid _Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e");
        private readonly Guid _Id1 = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e");
        private readonly List<Attachment> _attachments = new List<Attachment>
            {
                new Attachment()
                {
                    Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e"),
                    MessageId = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e"),
                    ApplicationId = Guid.NewGuid(),
                    ListingId = Guid.NewGuid(),
                    Name = "test",
                    Type = "Montreal"

                },
                new Attachment()
                {
                    Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e"),
                    MessageId = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e"),
                    ApplicationId = Guid.NewGuid(),
                    ListingId = Guid.NewGuid(),
                    Name = "test",
                    Type = "Montreal"
                }
            };
        /*
        [Fact]
        public async Task Get_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            mockRepo.Setup(repo => repo.Attachment.GetAllAsync()).ReturnsAsync(GetTestAttachment());
            var controller = new AttachmentController(mockRepo.Object);

            // Act
            var result = await controller.Get();

            // Assert
            var entities = Assert.IsAssignableFrom<IEnumerable<Attachment>>(result);
            Assert.Equal(2, entities.Count());
        }

        [Fact]
        public async Task GetById_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            mockRepo.Setup(repo => repo.Attachment.GetByIdAsync(_Id)).ReturnsAsync(GetTestAttachment().FirstOrDefault(
            s => s.Id == _Id));
            var controller = new AttachmentController(mockRepo.Object);

            // Act
            var result = await controller.GetById(_Id);

            // Assert
            var entity = Assert.IsAssignableFrom<Attachment>(result);
            Assert.Equal(_Id, entity.Id);
            Assert.Equal(_Id, entity.MessageId);
            Assert.Equal(_Id, entity.ApplicationId);
            Assert.Equal(_Id, entity.ListingId);
            Assert.Equal("test", entity.Name);
            Assert.Equal("Montreal", entity.Type);
        }

        [Fact]
        public async Task Add_Returns_correct_data()
        {
            // Arrange
            Attachment test_Attachment = new Attachment()
            {
                Id = _Id,
                MessageId = _Id,
                ApplicationId = _Id,
                ListingId = _Id,
                Name = "test",
                Type = "Montreal"

            };
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _attachments.Count;
            mockRepo.Setup(repo => repo.Attachment.AddAsync(test_Attachment)).Callback<Attachment>((x) => { _attachments.Add(x); }).ReturnsAsync(test_Attachment.Id);
            
            var controller = new AttachmentController(mockRepo.Object);
            
            // Act
            var result = await controller.Add(test_Attachment);

            // Assert
            var entity = Assert.IsAssignableFrom<Guid>(result);
            Assert.Equal(_Id, entity);
            Assert.True(len < _attachments.Count);
        }
        */
        [Fact]
        public void Delete_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _attachments.Count;
            mockRepo.Setup(repo => repo.Attachment.DeleteAsync(_Id)).Callback<Guid>((x) => { _attachments.Remove(_attachments.FirstOrDefault(s => s.Id == x)); });
            var controller = new AttachmentController(mockRepo.Object);

            // Act
            controller.Delete(_Id);

            // Assert
            Assert.True(len >= _attachments.Count);
        }

        [Fact]
        public void Update_Returns_correct_data()
        {
            // Arrange
            Attachment test_Attachment = new Attachment()
            {
                Id = _Id,
                MessageId = _Id,
                ApplicationId = _Id,
                ListingId = _Id,
                Name = "test",
                Type = "Montreal"

            };
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _attachments.Count;
            //mockRepo.Setup(repo => repo.Attachment.GetByIdAsync(test_Attachment.Id)).ReturnsAsync(_attachments.FirstOrDefault(s => s.Id == test_Attachment.Id));
            mockRepo.Setup(repo => repo.Attachment.UpdateAsync(test_Attachment)).Callback<Attachment>((x) => { _attachments[_attachments.FindIndex(s => s.Id == x.Id)] = x; });
            
            var controller = new AttachmentController(mockRepo.Object);

            // Act
            controller.Update(test_Attachment);

            // Assert
            Assert.Equal(len, _attachments.Count);
            //Assert.Equal(_attachments.FirstOrDefault(s => s.Id == test_Attachment.Id), test_Attachment);
        }

        #region snippet_GetTestSessions
        private List<Attachment> GetTestAttachment()
        {
            var sessions = new List<Attachment>
            {
                new Attachment()
                {
                    Id = _Id,
                    MessageId = _Id,
                    ApplicationId = _Id,
                    ListingId = _Id,
                    Name = "test",
                    Type = "Montreal"

                },
                new Attachment()
                {
                    Id = _Id1,
                    MessageId = _Id,
                    ApplicationId = _Id,
                    ListingId = _Id,
                    Name = "test",
                    Type = "Montreal"
                }
            };
            return sessions;
        }
        #endregion
    }
}
