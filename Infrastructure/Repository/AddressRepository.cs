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
    public class AddressRepository : IAddressRepository
    {

        private readonly IConfiguration sqlServerconfiguration;
        public AddressRepository(IConfiguration configuration)
        {
            this.sqlServerconfiguration = configuration;
        }

        public async Task<Guid> AddAsync(Address entity)
        {
            var sql = "Insert into Address (CivicNumber,StreetName,City,PostalCode,Country,State,ApartmentNumber) OUTPUT INSERTED.[Id] VALUES (@CivicNumber,@StreetName,@City,@PostalCode,@Country,@State,@ApartmentNumber)";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.QuerySingleAsync<Guid>(sql, entity);
            }
        }

        public async Task<int> DeleteAsync(Guid id)
        {
            var sql = "DELETE FROM Address WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.ExecuteAsync(sql, new { Id = id });
            }
        }

        public async Task<IReadOnlyList<Address>> GetAllAsync()
        {
            var sql = "SELECT * FROM Address";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Address>(sql);
                return result.AsList();
            }
        }

        public async Task<Address> GetByIdAsync(Guid id)
        {
            var sql = "SELECT * FROM Address WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.QuerySingleOrDefaultAsync<Address>(sql, new { Id = id });
            }
        }

        public async Task<IReadOnlyList<Address>> GetByListIdAsync(Guid[] ids)
        {
            var sql = $"SELECT * FROM Address WHERE Id in ({string.Join(", ", ids.Select(i => "'" + i.ToString() + "'"))})";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Address>(sql);
                return result.AsList();
            }
        }

        public async Task<int> UpdateAsync(Address entity)
        {
            var sql = "UPDATE Address SET CivicNumber = @CivicNumber, StreetName = @StreetName, City = @City, PostalCode = @PostalCode, Country = @Country, State = @State, ApartmentNumber = @ApartmentNumber WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.ExecuteAsync(sql, entity);
            }
        }
    }
}