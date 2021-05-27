using System.Collections;
using System.Collections.Generic;

namespace Infrastructure.Localize
{
    public class WildcardDictionary<T> : IDictionary<string, T>
    {
        private const string Default = "*";

        public WildcardDictionary()
        {
            data = new Dictionary<string, T>();
        }

        public bool IsReadOnly => false;
        public ICollection<string> Keys => data.Keys;
        public ICollection<T> Values => data.Values;
        public int Count => data.Count;
        private Dictionary<string, T> data { get; set; }

        public T this[string key]
        {
            get
            {
                if (TryGetValue(key, out var value))
                    return value;
                return default(T);
            }

            set => data[key] = value;
        }

        public void Add(string key, T value)
        {
            data.Add(key, value);
        }

        public void Add(KeyValuePair<string, T> item)
        {
            data.Add(item.Key, item.Value);
        }

        public void Clear()
        {
            data.Clear();
        }

        public bool Contains(KeyValuePair<string, T> item)
        {
            return data.ContainsKey(item.Key) && data.ContainsValue(item.Value);
        }

        public bool ContainsKey(string key)
        {
            return data.ContainsKey(key);
        }

        public void CopyTo(KeyValuePair<string, T>[] array, int arrayIndex)
        {
            throw new System.NotImplementedException();
        }

        public IEnumerator<KeyValuePair<string, T>> GetEnumerator()
        {
            return data.GetEnumerator();
        }

        public bool Remove(string key)
        {
            return data.Remove(key);
        }

        public bool Remove(KeyValuePair<string, T> item)
        {
            throw new System.NotImplementedException();
        }

        public bool TryGetValue(string key, out T value)
        {
            if (data.TryGetValue(key, out value))
                return true;

            if (data.TryGetValue(Default, out value))
                return true;

            return false;
        }

        public override bool Equals(object obj)
        {
            if (obj == null)
                return false;
            var objDict = obj as WildcardDictionary<T>;
            if (objDict == null)
                return false;

            if (Keys.Count != objDict.Keys.Count)
                return false;

            foreach (var key in Keys)
            {
                if (!objDict.TryGetValue(key, out var value))
                    return false;

                if (!data[key].Equals(value))
                    return false;
            }

            return true;
        }

        public override int GetHashCode()
        {
            return base.GetHashCode();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return data.GetEnumerator();
        }
    }
}
