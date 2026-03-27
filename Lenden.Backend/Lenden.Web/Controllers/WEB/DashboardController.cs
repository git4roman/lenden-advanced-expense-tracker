using Microsoft.AspNetCore.Mvc;

namespace Lenden.Web.Controllers.WEB;

public class DashboardController : Controller
{
    // GET
    public IActionResult Index()
    {
        return View();
    }
}