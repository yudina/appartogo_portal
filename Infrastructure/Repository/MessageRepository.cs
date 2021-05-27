using System;
using System.Collections.Generic;
using System.Text;
using Appartogo.Core.DAL.Interfaces;
using Appartogo.Core.DAL.Entities;
using System.Threading.Tasks;
using System.Data.SqlClient;
using Dapper;
using Microsoft.Extensions.Configuration;
using System.Linq;

namespace Infrastructure.Repository
{
    public class MessageRepository : IMessageRepository
    {

        private readonly IConfiguration sqlServerconfiguration;
        public MessageRepository(IConfiguration configuration)
        {
            this.sqlServerconfiguration = configuration;
        }


        public async Task<Guid> AddAsync(Message entity)
        {
            var sql = "Insert into Message (ConversationId,SenderId,ReceiverId,Text,HasAttachment,IsPartOfApplication,WasReceived,Archived) OUTPUT INSERTED.[Id] VALUES (@ConversationId,@SenderId,@ReceiverId,@Text,@HasAttachment,@IsPartOfApplication,@WasReceived,@Archived)";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.QuerySingleAsync<Guid>(sql, entity);
            }
        }

        public async Task<int> DeleteAsync(Guid id)
        {
            var sql = "DELETE FROM Message WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.ExecuteAsync(sql, new { Id = id });
            }
        }

        public async Task<IReadOnlyList<Message>> GetAllAsync()
        {
            var sql = "SELECT * FROM Message";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Message>(sql);
                return result.AsList();
            }
        }

        public async Task<Message> GetByIdAsync(Guid id)
        {
            var sql = "SELECT * FROM Message WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.QuerySingleOrDefaultAsync<Message>(sql, new { Id = id });
            }
        }

        public async Task<IReadOnlyList<Message>> GetByListIdAsync(Guid[] ids)
        {
            var sql = $"SELECT * FROM Message WHERE Id in ({string.Join(", ", ids.Select(i => "'" + i.ToString() + "'"))})";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Message>(sql);
                return result.AsList();
            }
        }

        public async Task<int> UpdateAsync(Message entity)
        {
            var sql = "UPDATE Message SET ConversationId = @ConversationId, SenderId = @SenderId, ReceiverId = @ReceiverId, Text = @Text, HasAttachment = @HasAttachment, IsPartOfApplication = @IsPartOfApplication, WasReceived = @WasReceived, Archived = @Archived WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.ExecuteAsync(sql, entity);
            }
        }

        public async Task<IReadOnlyList<Message>> GetMessageByConversationIdAsync(Guid conversationId)
        {
            var sql = "SELECT * FROM Message WHERE ConversationId = @ConversationId";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Message>(sql, new { ConversationId = conversationId });
                return result.AsList();
            }

        }

        public async Task<Message> GetFirstMessageByConversationIdAsync(Guid conversationId)
        {
            var sql = "SELECT TOP 1 * FROM Message WHERE ConversationId = @ConversationId ORDER BY SentDate";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.QuerySingleOrDefaultAsync<Message>(sql, new { ConversationId = conversationId });
            }

        }

        public async Task<IReadOnlyList<Message>> GetApplicationMessageByConversationIdAsync(Guid conversationId)
        {
            var sql = "SELECT * FROM Message WHERE ConversationId = @ConversationId AND IsPartOfApplication = 1 ORDER BY SentDate";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Message>(sql, new { ConversationId = conversationId });
                return result.AsList();
            }
        }

        public async Task<IReadOnlyList<Message>> GetAllUnarchivedAsync()
        {
            var sql = "SELECT * FROM Message WHERE Archived = 0";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Message>(sql);
                return result.AsList();
            }
        }
    }
}