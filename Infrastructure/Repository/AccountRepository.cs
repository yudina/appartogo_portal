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
    public class AccountRepository : IAccountRepository
    {

        private readonly IConfiguration sqlServerconfiguration;
        public AccountRepository(IConfiguration configuration)
        {
            this.sqlServerconfiguration = configuration;
        }
        public async Task<Guid> AddAsync(Account entity)
        {
            var sql = "Insert into Account (Id,AddressId,Email,FirstName,LastName,PhoneNumber,ProfilePictureUrl) OUTPUT INSERTED.[Id] VALUES (@Id,@AddressId,@Email,@FirstName,@LastName,@PhoneNumber,@ProfilePictureUrl)";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.QuerySingleAsync<Guid>(sql, entity);
            }
        }

        public async Task<int> DeleteAsync(Guid id)
        {
            var sql = "DELETE FROM Account WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.ExecuteAsync(sql, new { Id = id });
            }
        }

        public async Task<IReadOnlyList<Account>> GetAllAsync()
        {
            var sql = "SELECT * FROM Account";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Account>(sql);
                return result.AsList();
            }
        }

        public async Task<Account> GetByIdAsync(Guid id)
        {
            var sql = "SELECT * FROM Account WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.QuerySingleOrDefaultAsync<Account>(sql, new { Id = id });
            }
        }

        public async Task<IReadOnlyList<Account>> GetByListIdAsync(Guid[] ids)
        {
            var sql = $"SELECT * FROM Account WHERE Id in ({string.Join(", ", ids.Select(i => "'" + i.ToString() + "'"))})";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Account>(sql);
                return result.AsList();
            }
        }

        public async Task<int> UpdateAsync(Account entity)
        {
            var sql = "UPDATE Account SET AddressId = @AddressId, Email = @Email, FirstName = @FirstName, LastName = @LastName, PhoneNumber = @PhoneNumber, ProfilePictureUrl = @ProfilePictureUrl WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.ExecuteAsync(sql, entity);
            }
        }
    }
}
