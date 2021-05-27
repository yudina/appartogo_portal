using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Appartogo.Core.DAL.Entities;
using Appartogo.Core.DAL.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace AppartogoPortal.Hubs
{
    public class ChatHub : Hub
    {

        private readonly static ConnectionMapping<Guid> _connections = new ConnectionMapping<Guid>();
        private readonly string receiveMessageEvent = "ReceiveMessage";
        private IUnitOfWork unitOfWork;

        public ChatHub(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public override Task OnConnectedAsync()
        {
            Guid username = Guid.Parse(Context.GetHttpContext().Request.Query["username"]);
            _connections.Add(username, Context.ConnectionId);
            return base.OnConnectedAsync();
        }

        public async Task JoinRoom(Guid conversationId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, conversationId.ToString());
        }

        public async Task SendMessage(Message message)
        {

            var connections = _connections.GetConnections(message.ReceiverId);
            if (connections.Any())
            {
                foreach (var connectionId in connections)
                {
                    await Groups.AddToGroupAsync(connectionId, message.ConversationId.ToString());
                }
                message.WasReceived = true;
            }
            if(message.HasAttachment)
            {
                if (message.WasReceived)
                {
                    await unitOfWork.Message.UpdateAsync(message);
                }

            }
            else
            {
                message.Id = await unitOfWork.Message.AddAsync(message);
            }
            await Clients.Group(message.ConversationId.ToString()).SendAsync(receiveMessageEvent, message);
        }

        public override Task OnDisconnectedAsync(Exception e)
        {
            var key = _connections.GetKey(Context.ConnectionId);
            _connections.Remove(key, Context.ConnectionId);
            return base.OnDisconnectedAsync(e);
        }

    }
}
