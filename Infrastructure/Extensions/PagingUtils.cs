using System;
using System.Collections.Generic;
using System.Linq;

namespace Infrastructure.Extensions
{
    public static class PagingUtils
    {
        public static int GetPageCount(int itemsCount, int itemsPerPage)
        {
            if (itemsCount <= 0)
                return 1;
            return (int)Math.Ceiling((double)itemsCount / itemsPerPage);
        }

        public static IList<T> FilterListForPage<T>(this IEnumerable<T> list, int page, int itemsPerPage)
        {
            return list.Skip((page - 1) * itemsPerPage).Take(itemsPerPage).ToList();
        }
    }
}