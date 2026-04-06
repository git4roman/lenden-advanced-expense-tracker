using Microsoft.AspNetCore.Mvc;

namespace Lenden.Web.Controllers.WEB;

public class HomeController : Controller
{
    // GET
    public IActionResult Index()
    {
        var data = "Hello from the";
        return View(model:data);
    }
}