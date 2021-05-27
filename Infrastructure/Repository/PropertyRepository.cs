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
    public class PropertyRepository : IPropertyRepository
    {

        private readonly IConfiguration sqlServerconfiguration;
        public PropertyRepository(IConfiguration configuration)
        {
            this.sqlServerconfiguration = configuration;
        }


        public async Task<Guid> AddAsync(Property entity)
        {
            var sql = "Insert into Property (AddressId,OrganizationId,ApartmentCount,CanSmoke,AnimalsFriendly,Archived) OUTPUT INSERTED.[Id] VALUES (@AddressId,@OrganizationId,@ApartmentCount,@CanSmoke,@AnimalsFriendly,@Archived)";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.QuerySingleAsync<Guid>(sql, entity);
            }
        }

        public async Task<int> DeleteAsync(Guid id)
        {
            var sql = "DELETE FROM Property WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.ExecuteAsync(sql, new { Id = id });
            }
        }

        public async Task<IReadOnlyList<Property>> GetAllAsync()
        {
            var sql = "SELECT * FROM Property";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Property>(sql);
                return result.AsList();
            }
        }

        public async Task<Property> GetByIdAsync(Guid id)
        {
            var sql = "SELECT * FROM Property WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.QuerySingleOrDefaultAsync<Property>(sql, new { Id = id });
            }
        }

        public async Task<IReadOnlyList<Property>> GetPropertyByOrganizationIdAsync(Guid organizationId)
        {
            var sql = "SELECT * FROM Property WHERE OrganizationId = @OrganizationId";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Property>(sql, new { OrganizationId = organizationId });
                return result.AsList();
            }
        }

        public async Task<IReadOnlyList<Property>> GetPropertyByListOrganizationIdAsync(Guid[] organizationIds)
        {
            var sql = $"SELECT * FROM Property WHERE OrganizationId in ({string.Join(", ", organizationIds.Select(i => "'" + i.ToString() + "'"))})";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Property>(sql);
                return result.AsList();
            }
        }

        public async Task<int> UpdateAsync(Property entity)
        {
            var sql = "UPDATE Property SET AddressId = @AddressId, OrganizationId = @OrganizationId, ApartmentCount = @ApartmentCount, CanSmoke = @CanSmoke, AnimalsFriendly = @AnimalsFriendly, Archived = @Archived WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.ExecuteAsync(sql, entity);
            }
        }

        public async Task<IReadOnlyList<Property>> GetByListIdAsync(Guid[] ids)
        {
            var sql = $"SELECT * FROM Property WHERE Id in ({string.Join(", ", ids.Select(i => "'" + i.ToString() + "'"))})";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Property>(sql);
                return result.AsList();
            }
        }

        public async Task<IReadOnlyList<Property>> GetAllUnarchivedAsync()
        {
            var sql = "SELECT * FROM Property WHERE Archived = 0";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Property>(sql);
                return result.AsList();
            }
        }

        public async Task<IReadOnlyList<Property>> GetPropertyByOrganizationIdUnarchivedAsync(Guid organizationId)
        {
            var sql = "SELECT * FROM Property WHERE OrganizationId = @OrganizationId AND Archived = 0";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Property>(sql, new { OrganizationId = organizationId });
                return result.AsList();
            }
        }
    }
}