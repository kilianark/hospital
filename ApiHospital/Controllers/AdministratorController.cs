using System.Linq.Expressions;
using ApiHospital.Data;
using ApiHospital.Models;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace ApiHospital.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdministratorController : ControllerBase
    {
        private readonly HospitalContext _context;
        private readonly IMapper _mapper;

        public AdministratorController(HospitalContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        // GET: api/Administrators
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Administrator>>> GetAdministrators(
    [FromQuery] int? AdminCode = null,
    [FromQuery] string? Name = null,
    [FromQuery] string? Surname1 = null,
    [FromQuery] string? Surname2 = null,
    [FromQuery] string? Dni = null,
    [FromQuery] string? Phone = null,
    [FromQuery] string? Email = null,
    [FromQuery] string? Username = null,
    [FromQuery] string? Worktype = null,
    [FromQuery] int? Hospital = null
)
{
    IQueryable<Administrator> query = _context.Administrators.AsNoTracking();

    query = ApplyFilter(query, AdminCode, a => a.AdminCode == AdminCode!.Value);
    query = ApplyFilter(query, Name, a => !string.IsNullOrWhiteSpace(Name) && a.Name.ToLower().StartsWith(Name.ToLower()));
    query = ApplyFilter(query, Surname1, a => !string.IsNullOrWhiteSpace(Surname1) && a.Surname1.ToLower().StartsWith(Surname1.ToLower()));
    query = ApplyFilter(query, Surname2, a => !string.IsNullOrWhiteSpace(Surname2) && a.Surname2.ToLower().StartsWith(Surname2.ToLower()));
    query = ApplyFilter(query, Dni, a => !string.IsNullOrWhiteSpace(Dni) && a.Dni.ToLower().StartsWith(Dni.ToLower()));
    query = ApplyFilter(query, Phone, a => !string.IsNullOrWhiteSpace(Phone) && a.Phone.ToLower().StartsWith(Phone.ToLower()));
    query = ApplyFilter(query, Email, a => !string.IsNullOrEmpty(Email) && a.Email.ToLower().StartsWith(Email.ToLower()));
    query = ApplyFilter(query, Username, a => !string.IsNullOrEmpty(Username) && a.Username.ToLower().StartsWith(Username.ToLower()));
    query = ApplyFilter(query, Worktype, a => !string.IsNullOrEmpty(Worktype) && a.Worktype.ToLower().StartsWith(Worktype.ToLower()));
    query = ApplyFilter(query, Hospital, a => a.Hospital == Hospital!.Value);
    return await query.ToListAsync();
}

        private IQueryable<T> ApplyFilter<T>(
            IQueryable<T> query,
            object? filterValue,
            Expression<Func<T, bool>> filterExpression
        )
        {
            if (filterValue != null)
            {
                query = query.Where(filterExpression);
            }

            return query;
        }

        // GET: api/Administrators/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Administrator>> GetAdministrator(int id)
        {
            var administrator = await _context.Administrators.FindAsync(id);

            if (administrator == null)
            {
                return NotFound();
            }

            return administrator;
        }

        // PUT: api/Administrators/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAdministrator(int id, Administrator administrator)
        {
            if (id != administrator.Id)
            {
                return BadRequest();
            }

            _context.Entry(administrator).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AdministratorExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // POST: api/Administrators
        [HttpPost]
        public async Task<ActionResult<Administrator>> PostAdministrator(Administrator administrator)
        {
            _context.Administrators.Add(administrator);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAdministrator), new { id = administrator.Id }, administrator);
        }

        // DELETE: api/Administrators/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAdministrator(int id)
        {
            var administrator = await _context.Administrators.FindAsync(id);
            if (administrator == null)
            {
                return NotFound();
            }

            _context.Administrators.Remove(administrator);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PATCH: api/Administrators/5
        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchAdministrator(
            int id,
            [FromBody] JsonPatchDocument<Administrator> patchDocument
        )
        {
            if (patchDocument == null)
                return BadRequest();

            var administrator = await _context.Administrators.FindAsync(id);

            if (administrator == null)
                return NotFound();

            patchDocument.ApplyTo(administrator, ModelState);

            if (!TryValidateModel(administrator))
                return BadRequest(ModelState);

            await _context.SaveChangesAsync();

            return Ok(administrator);
        }

        private bool AdministratorExists(int id)
        {
            return _context.Administrators.Any(e => e.Id == id);
        }
    }
}
