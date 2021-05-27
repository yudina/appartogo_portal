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
    public class OrganizationAccountRepository : IOrganizationAccountRepository
    {

        private readonly IConfiguration sqlServerconfiguration;
        public OrganizationAccountRepository(IConfiguration configuration)
        {
            this.sqlServerconfiguration = configuration;
        }


        public async Task<Guid> AddAsync(OrganizationAccount entity)
        {
            var sql = "Insert into OrganizationAccount (AccountId,OrganizationId) OUTPUT INSERTED.[Id] VALUES (@AccountId,@OrganizationId)";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.QuerySingleAsync<Guid>(sql, entity);
            }
        }

        public async Task<int> DeleteAsync(Guid id)
        {
            var sql = "DELETE FROM OrganizationAccount WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.ExecuteAsync(sql, new { Id = id });
            }
        }

        public async Task<IReadOnlyList<OrganizationAccount>> GetAllAsync()
        {
            var sql = "SELECT * FROM OrganizationAccount";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<OrganizationAccount>(sql);
                return result.AsList();
            }
        }

        public async Task<OrganizationAccount> GetByIdAsync(Guid id)
        {
            var sql = "SELECT * FROM OrganizationAccount WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.QuerySingleOrDefaultAsync<OrganizationAccount>(sql, new { Id = id });
            }
        }

        public async Task<IReadOnlyList<OrganizationAccount>> GetByListIdAsync(Guid[] ids)
        {
            var sql = $"SELECT * FROM OrganizationAccount WHERE Id in ({string.Join(", ", ids.Select(i => "'" + i.ToString() + "'"))})";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<OrganizationAccount>(sql);
                return result.AsList();
            }
        }

        public async Task<IReadOnlyList<OrganizationAccount>> GetOrganizationAccountByAccountIdAsync(Guid accountId)
        {
            var sql = "SELECT * FROM OrganizationAccount WHERE AccountId = @AccountId";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<OrganizationAccount>(sql, new { AccountId = accountId });
                return result.AsList();
            }
        }

        public async Task<IReadOnlyList<OrganizationAccount>> GetOrganizationAccountByOrganizationIdAsync(Guid organizationId)
        {
            var sql = "SELECT * FROM OrganizationAccount WHERE OrganizationId = @OrganizationId";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<OrganizationAccount>(sql, new { OrganizationId = organizationId });
                return result.AsList();
            }
        }

        public async Task<int> UpdateAsync(OrganizationAccount entity)
        {
            var sql = "UPDATE OrganizationAccount SET AccountId = @AccountId, OrganizationId = @OrganizationId WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.ExecuteAsync(sql, entity);
            }
        }
    }
}