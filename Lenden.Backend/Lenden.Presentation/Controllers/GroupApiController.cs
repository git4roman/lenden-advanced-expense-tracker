using Lenden.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Lenden.Presentation.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class GroupApiController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        public GroupApiController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        
        
    }
}
