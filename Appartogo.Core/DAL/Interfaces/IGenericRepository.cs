using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Appartogo.Core.DAL.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        Task<T> GetByIdAsync(Guid id);
        Task<IReadOnlyList<T>> GetByListIdAsync(Guid[] ids);
        Task<IReadOnlyList<T>> GetAllAsync();
        Task<Guid> AddAsync(T entity);
        Task<int> UpdateAsync(T entity);
        Task<int> DeleteAsync(Guid id);
    }
}
