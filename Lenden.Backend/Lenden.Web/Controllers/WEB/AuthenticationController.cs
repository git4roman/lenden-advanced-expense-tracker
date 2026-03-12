using Microsoft.AspNetCore.Mvc;

namespace Lenden.Web.Controllers.WEB;

public class AuthenticationController : Controller
{
    // GET
    public IActionResult Index()
    {
        return View();
    }

    public IActionResult Login()
    {
        return View();
    }
    public IActionResult Register()
    {
        return View();
    }
}