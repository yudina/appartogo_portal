namespace Infrastructure.FileSystem
{
    public interface IFileSystemFactory
    {
        IFileSystem Get(string name);

        int Count();
    }
}
