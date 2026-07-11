using Entitys.User;

namespace BusinessLogic.Services.Interface
{
    public interface ITokenService
    {
        string CreateToken(User user);
    }

}
