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
    public class ApartmentRepository : IApartmentRepository
    {

        private readonly IConfiguration sqlServerconfiguration;
        public ApartmentRepository(IConfiguration configuration)
        {
            this.sqlServerconfiguration = configuration;
        }


        public async Task<Guid> AddAsync(Apartment entity)
        {
            
            var sql = "Insert into Apartment (ApartmentNumber,PropertyId,ApartmentType,Rooms,Bathrooms,Size,HasWater,HasHeater,HasParking,HasFurniture,HasAirconditioner,HasCable,HasInternet,AvailibityDate,Archived) OUTPUT INSERTED.[Id] VALUES (@ApartmentNumber,@PropertyId,@ApartmentType,@Rooms,@Bathrooms,@Size,@HasWater,@HasHeater,@HasParking,@HasFurniture,@HasAirconditioner,@HasCable,@HasInternet,@AvailibityDate,@Archived)";
            if (entity.TenantId != Guid.Empty)
            {
                sql = "Insert into Apartment (ApartmentNumber,TenantId,PropertyId,ApartmentType,Rooms,Bathrooms,Size,HasWater,HasHeater,HasParking,HasFurniture,HasAirconditioner,HasCable,HasInternet,AvailibityDate,Archived) OUTPUT INSERTED.[Id] VALUES (@ApartmentNumber,@TenantId,@PropertyId,@ApartmentType,@Rooms,@Bathrooms,@Size,@HasWater,@HasHeater,@HasParking,@HasFurniture,@HasAirconditioner,@HasCable,@HasInternet,@AvailibityDate,@Archived)";
            }
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.QuerySingleAsync<Guid>(sql, entity);
            }
        }

        public async Task<int> DeleteAsync(Guid id)
        {
            var sql = "DELETE FROM Apartment WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.ExecuteAsync(sql, new { Id = id });
            }
        }

        public async Task<IReadOnlyList<Apartment>> GetAllAsync()
        {
            var sql = "SELECT * FROM Apartment";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Apartment>(sql);
                return result.AsList();
            }
        }

        public async Task<Apartment> GetByIdAsync(Guid id)
        {
            var sql = "SELECT * FROM Apartment WHERE Id = @Id";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.QuerySingleOrDefaultAsync<Apartment>(sql, new { Id = id });
            }
        }

        public async Task<IReadOnlyList<Apartment>> GetApartmentByPropertyIdAsync(Guid propertyId)
        {
            var sql = "SELECT * FROM Apartment WHERE PropertyId = @PropertyId";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Apartment>(sql, new { PropertyId = propertyId });
                return result.AsList();
            }
        }

        public async Task<IReadOnlyList<Apartment>> GetApartmentByTenantIdAsync(Guid tenantId)
        {
            var sql = "SELECT * FROM Apartment WHERE TenantId = @TenantId";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Apartment>(sql, new { TenantId = tenantId });
                return result.AsList();
            }
        }

        public async Task<int> UpdateAsync(Apartment entity)
        {
            var sql = "UPDATE Apartment SET ApartmentNumber = @ApartmentNumber, PropertyId = @PropertyId, ApartmentType = @ApartmentType, Rooms = @Rooms, Bathrooms = @Bathrooms, Size = @Size, HasWater = @HasWater, HasHeater = @HasHeater, HasParking = @HasParking, HasFurniture = @HasFurniture, HasAirconditioner = @HasAirconditioner, HasCable = @HasCable, HasInternet = @HasInternet, AvailibityDate = @AvailibityDate, Archived = @Archived WHERE Id = @Id";
            if (entity.TenantId != Guid.Empty)
            {
                sql = "UPDATE Apartment SET ApartmentNumber = @ApartmentNumber, TenantId = @TenantId, PropertyId = @PropertyId, ApartmentType = @ApartmentType, Rooms = @Rooms, Bathrooms = @Bathrooms, Size = @Size, HasWater = @HasWater, HasHeater = @HasHeater, HasParking = @HasParking, HasFurniture = @HasFurniture, HasAirconditioner = @HasAirconditioner, HasCable = @HasCable, HasInternet = @HasInternet, AvailibityDate = @AvailibityDate, Archived = @Archived WHERE Id = @Id";
            }
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                return await connection.ExecuteAsync(sql, entity);
            }
        }

        public async Task<IReadOnlyList<Apartment>> GetApartmentByListPropertyIdAsync(Guid[] propertyIds)
        {
            var sql = $"SELECT * FROM Apartment WHERE PropertyId in ({string.Join(", ", propertyIds.Select(i => "'" + i.ToString() + "'"))})";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Apartment>(sql);
                return result.AsList();
            }
        }

        public async Task<IReadOnlyList<Apartment>> GetByListIdAsync(Guid[] ids)
        {
            var sql = $"SELECT * FROM Apartment WHERE Id in ({string.Join(", ", ids.Select(i => "'" + i.ToString() + "'"))})";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Apartment>(sql);
                return result.AsList();
            }
        }

        public async Task<IReadOnlyList<Apartment>> GetAllUnarchivedAsync()
        {
            var sql = "SELECT * FROM Apartment WHERE Archived = 0";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Apartment>(sql);
                return result.AsList();
            }
        }

        public async Task<IReadOnlyList<Apartment>> GetApartmentByListPropertyIdUnarchivedAsync(Guid[] propertyIds)
        {
            var sql = $"SELECT * FROM Apartment WHERE PropertyId in ({string.Join(", ", propertyIds.Select(i => "'" + i.ToString() + "'"))}) AND Archived = 0";
            using (var connection = new SqlConnection(sqlServerconfiguration.GetConnectionString("DefaultSqlServerConnection")))
            {
                connection.Open();
                var result = await connection.QueryAsync<Apartment>(sql);
                return result.AsList();
            }
        }
    }
}