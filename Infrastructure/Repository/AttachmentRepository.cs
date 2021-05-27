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
    public class AttachmentRepository : IAttachmentRepository
    {

        private readonly IConfiguration sqlServerconfiguration;
        public AttachmentRepository(IConfiguration configuration)
        {
            this.sqlServerconfiguration = configuration;
        }


        public async Task<Guid> AddAsync(Attachment entity)
        {
            string sql;
            if (entity.ListingId != Guid.Empty)
            {
                sql = "Insert into Attachment (ListingId,Name,Type) OUTPUT INSERTED.[Id] VALUES (@ListingId,@Name,@Type)";
            }
            else if (entity.ApplicationId != Guid.Empty)
            {
                sql = "Insert into Attachment (ApplicationId,Name,Type) OUTPUT INSERTED.[Id] VALUES (@ApplicationId,@Name,@Type)";
            }
            else
            {
                sql = "Insert into Attachment (MessageId,Name,Type) OUTPUT INSERTED.[Id] VALUES (@MessageId,@Name,@Type)";
            }
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.QuerySingleAsync<Guid>(sql, entity);
            }
        }

        public async Task<int> DeleteAsync(Guid id)
        {
            var sql = "DELETE FROM Attachment WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.ExecuteAsync(sql, new { Id = id });
            }
        }

        public async Task<IReadOnlyList<Attachment>> GetAllAsync()
        {
            var sql = "SELECT * FROM Attachment";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Attachment>(sql);
                return result.AsList();
            }
        }

        public async Task<Attachment> GetByIdAsync(Guid id)
        {
            var sql = "SELECT * FROM Attachment WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.QuerySingleOrDefaultAsync<Attachment>(sql, new { Id = id });
            }
        }

        public async Task<IReadOnlyList<Attachment>> GetByListIdAsync(Guid[] ids)
        {
            var sql = $"SELECT * FROM Attachment WHERE Id in ({string.Join(", ", ids.Select(i => "'" + i.ToString() + "'"))})";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Attachment>(sql);
                return result.AsList();
            }
        }

        public async Task<int> UpdateAsync(Attachment entity)
        {
            string sql;
            if (entity.ListingId != Guid.Empty)
            {
                sql = "UPDATE Attachment SET ListingId = @ListingId, Name = @Name, Type = @Type WHERE Id = @Id";
            }
            else if (entity.ApplicationId != Guid.Empty)
            {
                sql = "UPDATE Attachment SET ApplicationId = @ApplicationId, Name = @Name, Type = @Type WHERE Id = @Id";
            }
            else
            {
                sql = "UPDATE Attachment SET MessageId = @MessageId, Name = @Name, Type = @Type WHERE Id = @Id";
            }
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.ExecuteAsync(sql, entity);
            }
        }

        public async Task<IReadOnlyList<Attachment>> GetAttachmentByListingIdAsync(Guid listingId)
        {
            var sql = "SELECT Id, ListingId, Name, Type FROM Attachment WHERE ListingId = @ListingId";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Attachment>(sql, new { ListingId = listingId });
                return result.AsList();
            }
        }
        public async Task<IReadOnlyList<Attachment>> GetAttachmentByListListingIdAsync(Guid[] listingIds)
        {
            var sql = $"SELECT Id, ListingId, Name, Type FROM Attachment WHERE ListingId in ({string.Join(", ", listingIds.Select(i => "'" + i.ToString() + "'"))})";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Attachment>(sql);
                return result.AsList();
            }
        }

        public async Task<IReadOnlyList<Attachment>> GetAttachmentByApplicationIdAsync(Guid applicationId)
        {
            var sql = "SELECT Id, ApplicationId, Name, Type FROM Attachment WHERE ApplicationId = @ApplicationId";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Attachment>(sql, new { ApplicationId = applicationId });
                return result.AsList();
            }
        }
        public async Task<IReadOnlyList<Attachment>> GetAttachmentByListApplicationIdAsync(Guid[] applicationIds)
        {
            var sql = $"SELECT Id, ApplicationId, Name, Type FROM Attachment WHERE ApplicationId in ({string.Join(", ", applicationIds.Select(i => "'" + i.ToString() + "'"))})";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Attachment>(sql);
                return result.AsList();
            }
        }

        public async Task<IReadOnlyList<Attachment>> GetAttachmentByMessageIdAsync(Guid messageId)
        {
            var sql = "SELECT Id, MessageId, Name, Type FROM Attachment WHERE MessageId = @MessageId";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Attachment>(sql, new { MessageId = messageId });
                return result.AsList();
            }
        }
    }
}