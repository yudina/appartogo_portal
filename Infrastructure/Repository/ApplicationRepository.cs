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
    public class ApplicationRepository : IApplicationRepository
    {

        private readonly IConfiguration sqlServerconfiguration;
        public ApplicationRepository(IConfiguration configuration)
        {
            this.sqlServerconfiguration = configuration;
        }

        public async Task<Guid> AddAsync(Application entity)
        {
            var sql = "Insert into Application (AccountId,ListingId,ConsentForCreditCheck,WantsRentalInsurance,Status) OUTPUT INSERTED.[Id] VALUES (@AccountId,@ListingId,@ConsentForCreditCheck,@WantsRentalInsurance,@Status)";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.QuerySingleAsync<Guid>(sql, entity);
            }
        }

        public async Task<int> DeleteAsync(Guid id)
        {
            var sql = "DELETE FROM Application WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.ExecuteAsync(sql, new { Id = id });
            }
        }

        public async Task<IReadOnlyList<Application>> GetAllAsync()
        {
            var sql = "SELECT * FROM Application";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Application>(sql);
                return result.AsList();
            }
        }

        public async Task<Application> GetByIdAsync(Guid id)
        {
            var sql = "SELECT * FROM Application WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.QuerySingleOrDefaultAsync<Application>(sql, new { Id = id });
  
            }
        }

        public async Task<IReadOnlyList<Application>> GetApplicationByListListingIdAsync(Guid[] listingIds)
        {
            var sql = $"SELECT * FROM Application WHERE ListingId in ({string.Join(", ", listingIds.Select(i => "'" + i.ToString() + "'"))})";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Application>(sql);
                return result.AsList();
            }
        }

        public async Task<IReadOnlyList<Application>> GetApplicationByAccountIdAsync(Guid accountId)
        {
            var sql = "SELECT * FROM Application WHERE AccountId = @AccountId";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Application>(sql, new { AccountId = accountId });
                return result.AsList();
            }
        }

        public async Task<IReadOnlyList<Application>> GetApplicationByListingIdAsync(Guid listingId)
        {
            var sql = "SELECT * FROM Application WHERE ListingId = @ListingId";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Application>(sql, new { ListingId = listingId });
                return result.AsList();
            }
        }

        public async Task<int> UpdateAsync(Application entity)
        {
            var sql = "UPDATE Application SET AccountId = @AccountId, ListingId = @ListingId, ConsentForCreditCheck = @ConsentForCreditCheck, WantsRentalInsurance = @WantsRentalInsurance, Status = @Status WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.ExecuteAsync(sql, entity);
            }
        }

        public async Task<IReadOnlyList<Application>> GetByListIdAsync(Guid[] ids)
        {
            var sql = $"SELECT * FROM Application WHERE Id in ({string.Join(", ", ids.Select(i => "'" + i.ToString() + "'"))})";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Application>(sql);
                return result.AsList();
            }
        }
    }
}