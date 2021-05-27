using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Appartogo.Core.DAL.Interfaces;
using Appartogo.Core.DAL.Entities;
using System.Data.SqlClient;
using Dapper;
using Microsoft.Extensions.Configuration;
using System.Linq;

namespace Infrastructure.Repository
{
    public class TenantRepository : ITenantRepository
    {

        private readonly IConfiguration sqlServerconfiguration;
        public TenantRepository(IConfiguration configuration)
        {
            this.sqlServerconfiguration = configuration;
        }


        public async Task<Guid> AddAsync(Tenant entity)
        {
            var sql = "Insert into Tenant (AccountId,CreditScore,RentalInsuranceNumber,ActiveLease) OUTPUT INSERTED.[Id] VALUES (@AccountId,@CreditScore,@RentalInsuranceNumber,@ActiveLease)";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.QuerySingleAsync<Guid>(sql, entity);
            }
        }

        public async Task<int> DeleteAsync(Guid id)
        {
            var sql = "DELETE FROM Tenant WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.ExecuteAsync(sql, new { Id = id });
            }
        }

        public async Task<IReadOnlyList<Tenant>> GetAllAsync()
        {
            var sql = "SELECT * FROM Tenant";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Tenant>(sql);
                return result.AsList();
            }
        }

        public async Task<Tenant> GetByIdAsync(Guid id)
        {
            var sql = "SELECT * FROM Tenant WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.QuerySingleOrDefaultAsync<Tenant>(sql, new { Id = id });
            }
        }

        public async Task<IReadOnlyList<Tenant>> GetByListIdAsync(Guid[] ids)
        {
            var sql = $"SELECT * FROM Tenant WHERE Id in ({string.Join(", ", ids.Select(i => "'" + i.ToString() + "'"))})";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Tenant>(sql);
                return result.AsList();
            }
        }

        public async Task<IReadOnlyList<Tenant>> GetTenantByAccountIdAsync(Guid accountId)
        {
            var sql = "SELECT * FROM Tenant WHERE AccountId = @AccountId";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Tenant>(sql, new { AccountId = accountId });
                return result.AsList();
            }
        }

        public async Task<IReadOnlyList<Tenant>> GetTenantByListAccountIdAsync(Guid[] accountIds)
        {
            var sql = $"SELECT * FROM Tenant WHERE AccountId in ({string.Join(", ", accountIds.Select(i => "'" + i.ToString() + "'"))})";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Tenant>(sql);
                return result.AsList();
            }
        }

        public async Task<int> UpdateAsync(Tenant entity)
        {
            var sql = "UPDATE Tenant SET AccountId = @AccountId, CreditScore = @CreditScore, RentalInsuranceNumber = @RentalInsuranceNumber, ActiveLease = @ActiveLease WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.ExecuteAsync(sql, entity);
            }
        }
    }
}
