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
    public class OrganizationRepository : IOrganizationRepository
    {

        private readonly IConfiguration sqlServerconfiguration;
        public OrganizationRepository(IConfiguration configuration)
        {
            this.sqlServerconfiguration = configuration;
        }


        public async Task<Guid> AddAsync(Organization entity)
        {
            var sql = "Insert into Organization (AddressId,Name) OUTPUT INSERTED.[Id] VALUES (@AddressId,@Name)";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.QuerySingleAsync<Guid>(sql, entity);
            }
        }

        public async Task<int> DeleteAsync(Guid id)
        {
            var sql = "DELETE FROM Organization WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.ExecuteAsync(sql, new { Id = id });
            }
        }

        public async Task<IReadOnlyList<Organization>> GetAllAsync()
        {
            var sql = "SELECT * FROM Organization";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Organization>(sql);
                return result.AsList();
            }
        }

        public async Task<Organization> GetByIdAsync(Guid id)
        {
            var sql = "SELECT * FROM Organization WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.QuerySingleOrDefaultAsync<Organization>(sql, new { Id = id });
            }
        }

        public async Task<IReadOnlyList<Organization>> GetByListIdAsync(Guid[] ids)
        {
            var sql = $"SELECT * FROM Organization WHERE Id in ({string.Join(", ", ids.Select(i => "'" + i.ToString() + "'"))})";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Organization>(sql);
                return result.AsList();
            }
        }

        public async Task<int> UpdateAsync(Organization entity)
        {
            var sql = "UPDATE Organization SET AddressId = @AddressId, Name = @Name WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.ExecuteAsync(sql, entity);
            }
        }
    }
}