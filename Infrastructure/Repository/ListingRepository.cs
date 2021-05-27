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
    public class ListingRepository : IListingRepository
    {

        private readonly IConfiguration sqlServerconfiguration;
        public ListingRepository(IConfiguration configuration)
        {
            this.sqlServerconfiguration = configuration;
        }


        public async Task<Guid> AddAsync(Listing entity)
        {
            var sql = "Insert into Listing (ApartmentId,Titre,Description,Rent,Archived) OUTPUT INSERTED.[Id] VALUES (@ApartmentId,@Titre,@Description,@Rent,@Archived)";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.QuerySingleAsync<Guid>(sql, entity);
            }
        }

        public async Task<int> DeleteAsync(Guid id)
        {
            var sql = "DELETE FROM Listing WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.ExecuteAsync(sql, new { Id = id });
            }
        }

        public async Task<IReadOnlyList<Listing>> GetAllAsync()
        {
            var sql = "SELECT * FROM Listing";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Listing>(sql);
                return result.AsList();
            }
        }

        public async Task<IReadOnlyList<Listing>> GetAllUnarchivedAsync()
        {
            var sql = "SELECT * FROM Listing WHERE Archived = 0";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Listing>(sql);
                return result.AsList();
            }
        }

        public async Task<Listing> GetByIdAsync(Guid id)
        {
            var sql = "SELECT * FROM Listing WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.QuerySingleOrDefaultAsync<Listing>(sql, new { Id = id });
            }
        }

        public async Task<IReadOnlyList<Listing>> GetByListIdAsync(Guid[] ids)
        {
            var sql = $"SELECT * FROM Listing WHERE Id in ({string.Join(", ", ids.Select(i => "'" + i.ToString() + "'"))})";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Listing>(sql);
                return result.AsList();
            }
        }

        public async Task<IReadOnlyList<Listing>> GetListingByApartmentIdAsync(Guid apartmentId)
        {
            var sql = "SELECT * FROM Listing WHERE ApartmentId = @ApartmentId";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Listing>(sql, new { ApartmentId = apartmentId });
                return result.AsList();
            }
        }

        public async Task<IReadOnlyList<Listing>> GetListingByListApartmentIdAsync(Guid[] apartmentIds)
        {
            var sql = $"SELECT * FROM Listing WHERE ApartmentId in ({string.Join(", ", apartmentIds.Select(i => "'" + i.ToString() + "'"))})";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Listing>(sql);
                return result.AsList();
            }
        }

        public async Task<int> UpdateAsync(Listing entity)
        {
            var sql = "UPDATE Listing SET ApartmentId = @ApartmentId, Titre = @Titre, Description = @Description, Rent = @Rent, Archived = @Archived WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.ExecuteAsync(sql, entity);
            }
        }
    }
}
