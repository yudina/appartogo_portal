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
    public class ConversationRepository : IConversationRepository
    {

        private readonly IConfiguration sqlServerconfiguration;
        public ConversationRepository(IConfiguration configuration)
        {
            this.sqlServerconfiguration = configuration;
        }


        public async Task<Guid> AddAsync(Conversation entity)
        {
            var sql = "Insert into Conversation (ListingId,CreatedById,OtherParticipantId,Archived) OUTPUT INSERTED.[Id] VALUES (@ListingId,@CreatedById,@OtherParticipantId,@Archived)";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.QuerySingleAsync<Guid>(sql, entity);
            }
        }

        public async Task<int> DeleteAsync(Guid id)
        {
            var sql = "DELETE FROM Conversation WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.ExecuteAsync(sql, new { Id = id });
            }
        }

        public async Task<IReadOnlyList<Conversation>> GetAllAsync()
        {
            var sql = "SELECT * FROM Conversation";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Conversation>(sql);
                return result.AsList();
            }
        }

        public async Task<Conversation> GetByIdAsync(Guid id)
        {
            var sql = "SELECT * FROM Conversation WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.QuerySingleOrDefaultAsync<Conversation>(sql, new { Id = id });
            }
        }

        public async Task<IReadOnlyList<Conversation>> GetByListIdAsync(Guid[] ids)
        {
            var sql = $"SELECT * FROM Conversation WHERE Id in ({string.Join(", ", ids.Select(i => "'" + i.ToString() + "'"))})";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Conversation>(sql);
                return result.AsList();
            }
        }

        public async Task<IReadOnlyList<Conversation>> GetConversationByCreatedByIdAsync(Guid createdById)
        {
            var sql = "SELECT * FROM Conversation WHERE CreatedById = @CreatedById";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Conversation>(sql, new { CreatedById = createdById });
                return result.AsList();
            }
        }

        public async Task<IReadOnlyList<Conversation>> GetConversationByOtherParticipantIdAsync(Guid otherParticipantId)
        {
            var sql = "SELECT * FROM Conversation WHERE OtherParticipantId = @OtherParticipantId";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Conversation>(sql, new { OtherParticipantId = otherParticipantId });
                return result.AsList();
            }
        }
        public async Task<IReadOnlyList<Conversation>> GetConversationByListingIdAsync(Guid listingId)
        {
            var sql = "SELECT * FROM Conversation WHERE ListingId = @ListingId";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Conversation>(sql, new { ListingId = listingId });
                return result.AsList();
            }
        }
        public async Task<IReadOnlyList<Conversation>> GetConversationByListListingIdAsync(Guid[] listingIds)
        {
            var sql = $"SELECT * FROM Conversation WHERE ListingId in ({string.Join(", ", listingIds.Select(i => "'" + i.ToString() + "'"))})";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Conversation>(sql);
                return result.AsList();
            }
        }

        public async Task<int> UpdateAsync(Conversation entity)
        {
            var sql = "UPDATE Conversation SET ListingId = @ListingId, CreatedById = @CreatedById, OtherParticipantId = @OtherParticipantId, Archived = @Archived WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.ExecuteAsync(sql, entity);
            }
        }

        public async Task<IReadOnlyList<Conversation>> GetAllUnarchivedAsync()
        {
            var sql = "SELECT * FROM Conversation WHERE Archived = 0";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Conversation>(sql);
                return result.AsList();
            }
        }
    }
}