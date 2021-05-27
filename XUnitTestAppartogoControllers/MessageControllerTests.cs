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
    public class MessageControllerTests
    {
        private readonly Guid _Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e");
        private readonly Guid _Id1 = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e");
        private readonly List<Message> _messages = new List<Message>
            {
                new Message()
                {
                    Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e"),
                    ConversationId = Guid.NewGuid(),
                    SenderId = Guid.NewGuid(),
                    ReceiverId = Guid.NewGuid(),
                    Text = "test",
                    HasAttachment = true,
                    SentDate = DateTime.Now,
                    IsPartOfApplication = false,
                    WasReceived = true,
                    Archived = false


                },
                new Message()
                {
                    Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e"),
                    ConversationId = Guid.NewGuid(),
                    SenderId = Guid.NewGuid(),
                    ReceiverId = Guid.NewGuid(),
                    Text = "test",
                    HasAttachment = true,
                    SentDate = DateTime.Now,
                    IsPartOfApplication = true,
                    WasReceived = false,
                    Archived = false
                }
            };
        [Fact]
        public async Task Get_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            mockRepo.Setup(repo => repo.Message.GetAllAsync()).ReturnsAsync(GetTestMessage());
            var controller = new MessageController(mockRepo.Object);

            // Act
            var result = await controller.Get();

            // Assert
            var entities = Assert.IsAssignableFrom<IEnumerable<Message>>(result);
            Assert.Equal(2, entities.Count());
        }

        [Fact]
        public async Task GetById_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            mockRepo.Setup(repo => repo.Message.GetByIdAsync(_Id)).ReturnsAsync(GetTestMessage().FirstOrDefault(
            s => s.Id == _Id));
            var controller = new MessageController(mockRepo.Object);

            // Act
            var result = await controller.GetById(_Id);

            // Assert
            var entity = Assert.IsAssignableFrom<Message>(result);
            Assert.Equal(_Id, entity.Id);
            Assert.Equal(_Id, entity.ConversationId);
            Assert.Equal(_Id, entity.SenderId);
            Assert.Equal(_Id, entity.ReceiverId);
            Assert.Equal("test", entity.Text);
            Assert.True(entity.HasAttachment);
            Assert.True(DateTime.Now > entity.SentDate);
            Assert.False(entity.IsPartOfApplication);
            Assert.True(entity.WasReceived);
            Assert.False(entity.Archived);
        }

        [Fact]
        public async Task Add_Returns_correct_data()
        {
            // Arrange
            Message test_Message = new Message()
            {
                Id = _Id,
                ConversationId = _Id,
                SenderId = _Id,
                ReceiverId = _Id,
                Text = "test",
                HasAttachment = true,
                SentDate = DateTime.Now,
                IsPartOfApplication = false,
                WasReceived = true,
                Archived = false

            };
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _messages.Count;
            mockRepo.Setup(repo => repo.Message.AddAsync(test_Message)).Callback<Message>((x) => { _messages.Add(x); }).ReturnsAsync(test_Message.Id);
            var controller = new MessageController(mockRepo.Object);
            
            // Act
            var result = await controller.Add(test_Message);

            // Assert
            var entity = Assert.IsAssignableFrom<Guid>(result);
            Assert.Equal(_Id, entity);
            Assert.True(len < _messages.Count);
        }

        [Fact]
        public void Delete_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _messages.Count;
            mockRepo.Setup(repo => repo.Message.DeleteAsync(_Id)).Callback<Guid>((x) => { _messages.Remove(_messages.FirstOrDefault(s => s.Id == x)); });
            var controller = new MessageController(mockRepo.Object);

            // Act
            controller.Delete(_Id);

            // Assert
            Assert.True(len > _messages.Count);
        }

        [Fact]
        public void Update_Returns_correct_data()
        {
            // Arrange
            Message test_Message = new Message()
            {
                Id = _Id,
                ConversationId = _Id,
                SenderId = _Id,
                ReceiverId = _Id,
                Text = "test",
                HasAttachment = true,
                SentDate = DateTime.Now,
                IsPartOfApplication = false,
                WasReceived = true,
                Archived = false

            };
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _messages.Count;
            mockRepo.Setup(repo => repo.Message.UpdateAsync(test_Message)).Callback<Message>((x) => { _messages[_messages.FindIndex(s => s.Id == x.Id)] = x; });
            var controller = new MessageController(mockRepo.Object);

            // Act
            controller.Update(test_Message);

            // Assert
            Assert.Equal(len, _messages.Count);
            Assert.Equal(_messages.FirstOrDefault(s => s.Id == test_Message.Id), test_Message);
        }

        #region snippet_GetTestSessions
        private List<Message> GetTestMessage()
        {
            var sessions = new List<Message>
            {
                new Message()
                {
                    Id = _Id,
                    ConversationId = _Id,
                    SenderId = _Id,
                    ReceiverId = _Id,
                    Text = "test",
                    HasAttachment = true,
                    SentDate = DateTime.Now,
                    IsPartOfApplication = false,
                    WasReceived = true,
                    Archived = false


                },
                new Message()
                {
                    Id = _Id1,
                    ConversationId = _Id,
                    SenderId = _Id,
                    ReceiverId = _Id,
                    Text = "test",
                    HasAttachment = true,
                    SentDate = DateTime.Now,
                    IsPartOfApplication = true,
                    WasReceived = false,
                    Archived = false
                }
            };
            return sessions;
        }
        #endregion
    }
}
