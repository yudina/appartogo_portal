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
    public class ConversationControllerTests
    {
        private readonly Guid _Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e");
        private readonly Guid _Id1 = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e");
        private readonly List<Conversation> _conversations = new List<Conversation>
            {
                new Conversation()
                {
                    Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e"),
                    ListingId = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e"),
                    CreatedById = Guid.NewGuid(),
                    OtherParticipantId = Guid.NewGuid(),
                    Archived = false

                },
                new Conversation()
                {
                    Id = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea87e"),
                    ListingId = Guid.Parse("ddfaca09-8bf3-40e7-8304-99ce253ea86e"),
                    CreatedById = Guid.NewGuid(),
                    OtherParticipantId = Guid.NewGuid(),
                    Archived = false
                }
            };
        [Fact]
        public async Task Get_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            mockRepo.Setup(repo => repo.Conversation.GetAllAsync()).ReturnsAsync(GetTestConversation());
            var controller = new ConversationController(mockRepo.Object);

            // Act
            var result = await controller.Get();

            // Assert
            var entities = Assert.IsAssignableFrom<IEnumerable<Conversation>>(result);
            Assert.Equal(2, entities.Count());
        }

        [Fact]
        public async Task GetById_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            mockRepo.Setup(repo => repo.Conversation.GetByIdAsync(_Id)).ReturnsAsync(GetTestConversation().FirstOrDefault(
            s => s.Id == _Id));
            var controller = new ConversationController(mockRepo.Object);

            // Act
            var result = await controller.GetById(_Id);

            // Assert
            var entity = Assert.IsAssignableFrom<Conversation>(result);
            Assert.Equal(_Id, entity.Id);
            Assert.Equal(_Id1, entity.ListingId);
            Assert.Equal(_Id, entity.CreatedById);
            Assert.Equal(_Id, entity.OtherParticipantId);
            Assert.False(entity.Archived);
        }

        [Fact]
        public async Task Add_Returns_correct_data()
        {
            // Arrange
            Conversation test_Conversation = new Conversation()
            {
                Id = _Id,
                ListingId = _Id1,
                CreatedById = _Id,
                OtherParticipantId = _Id,
                Archived = false

            };
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _conversations.Count;
            mockRepo.Setup(repo => repo.Conversation.AddAsync(test_Conversation)).Callback<Conversation>((x) => { _conversations.Add(x); }).ReturnsAsync(test_Conversation.Id);
            var controller = new ConversationController(mockRepo.Object);
            
            // Act
            var result = await controller.Add(test_Conversation);

            // Assert
            var entity = Assert.IsAssignableFrom<Guid>(result);
            Assert.Equal(_Id, entity);
            Assert.True(len < _conversations.Count);
        }

        [Fact]
        public void Delete_Returns_correct_data()
        {
            // Arrange
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _conversations.Count;
            mockRepo.Setup(repo => repo.Conversation.DeleteAsync(_Id)).Callback<Guid>((x) => { _conversations.Remove(_conversations.FirstOrDefault(s => s.Id == x)); });
            var controller = new ConversationController(mockRepo.Object);

            // Act
            controller.Delete(_Id);

            // Assert
            Assert.True(len > _conversations.Count);
        }

        [Fact]
        public void Update_Returns_correct_data()
        {
            // Arrange
            Conversation test_Conversation = new Conversation()
            {
                Id = _Id,
                ListingId = _Id1,
                CreatedById = _Id,
                OtherParticipantId = _Id,
                Archived = false

            };
            var mockRepo = new Mock<IUnitOfWork>();
            var len = _conversations.Count;
            mockRepo.Setup(repo => repo.Conversation.UpdateAsync(test_Conversation)).Callback<Conversation>((x) => { _conversations[_conversations.FindIndex(s => s.Id == x.Id)] = x; });
            var controller = new ConversationController(mockRepo.Object);

            // Act
            controller.Update(test_Conversation);

            // Assert
            Assert.Equal(len, _conversations.Count);
            Assert.Equal(_conversations.FirstOrDefault(s => s.Id == test_Conversation.Id), test_Conversation);
        }

        #region snippet_GetTestSessions
        private List<Conversation> GetTestConversation()
        {
            var sessions = new List<Conversation>
            {
                new Conversation()
                {
                    Id = _Id,
                    ListingId = _Id1,
                    CreatedById = _Id,
                    OtherParticipantId = _Id,
                    Archived = false

                },
                new Conversation()
                {
                    Id = _Id1,
                    ListingId = _Id,
                    CreatedById = _Id,
                    OtherParticipantId = _Id,
                    Archived = false
                }
            };
            return sessions;
        }
        #endregion
    }
}
