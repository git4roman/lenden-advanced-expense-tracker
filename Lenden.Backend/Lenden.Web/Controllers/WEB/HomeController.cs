using Microsoft.AspNetCore.Mvc;

namespace Lenden.Web.Controllers.WEB;

public class HomeController : Controller
{
    // GET
    public IActionResult Index()
    {
        return View();
    }
}