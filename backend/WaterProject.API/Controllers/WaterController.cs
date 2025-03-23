using DefaultNamespace;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WaterProject.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class WaterController : ControllerBase
    {
        private WaterDbContext _context;
        
        public WaterController(WaterDbContext temp)
        {
            _context = temp;
        }

        [HttpGet("AllProjects")]
        public IActionResult GetProjects(int pageHowMany = 5, int pageNum = 1, [FromQuery] List<string>? projectTypes = null)
        {
            string FavProjectType = Request.Cookies["FavoriteProjectType"];
            Console.WriteLine(FavProjectType);
            
            HttpContext.Response.Cookies.Append("FavoriteProjectType", "Borehole Well and Hand Pump", 
                new CookieOptions { HttpOnly = true, Secure = true, 
                    SameSite = SameSiteMode.Strict, Expires = DateTime.Now.AddMinutes(1) });

            var query = _context.Projects.AsQueryable();

            if (projectTypes != null && projectTypes.Any())
            {
                query = query.Where(p => projectTypes.Contains(p.ProjectType));
            }
            var totalNumProjects = query.Count();
            var result = query.Skip((pageNum - 1) * pageHowMany).Take(pageHowMany).ToList();
            

            var someObject = new
            {
                Projects = result,
                TotalNumberProjects = totalNumProjects
            };
            
            return Ok(someObject);
        }

        [HttpGet("FunctionalProjects")]
        public IEnumerable<Project> GetFunctionalProjects()
        {
            var something = _context.Projects.Where(p => p.ProjectFunctionalityStatus == "Functional").ToList();
            return something;
        }

        [HttpGet("GetProjectTypes")]
        public IActionResult GetProjectTypes()
        {
            var projectTypes = _context.Projects.Select(p => p.ProjectType).Distinct().ToList();
            
            return Ok(projectTypes);
        }
    }
}
