using FirebaseAdmin.Auth;

namespace Lenden.Application.Services;

public class FirebaseService
{
    public async Task<FirebaseToken> VerifyTokenAsync(string idToken)
    {
        var decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken);
        return decodedToken; 
    }
}