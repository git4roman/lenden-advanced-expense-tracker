using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Lenden.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpenseApiController : ControllerBase
    {

        public ExpenseApiController()
        {
            
        }
        
        // GET: api/<ExpenseApiController>
        [HttpGet]
        public ActionResult<string> Get()
        {
            return "value";
        }
    }
}
