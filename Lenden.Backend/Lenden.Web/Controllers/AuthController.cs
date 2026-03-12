using Microsoft.AspNetCore.Mvc;

namespace Lenden.Web.Controllers;

public class AuthController: Controller
{
    public AuthController()
    {
        
    }
    
    [HttpGet]
    public IActionResult Login()
    {
        return View();
    }
}