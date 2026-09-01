namespace FurnitureShop.Api.Authentication;

public interface IPasswordHasher
{
    string Hash(string plainTextPassword);
    bool Verify(string plainTextPassword, string hash);
}

public class BCryptPasswordHasher : IPasswordHasher
{
    public string Hash(string plainTextPassword) => BCrypt.Net.BCrypt.HashPassword(plainTextPassword, workFactor: 12);

    public bool Verify(string plainTextPassword, string hash) => BCrypt.Net.BCrypt.Verify(plainTextPassword, hash);
}
