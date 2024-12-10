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
    public class NurseController : ControllerBase
    {
private readonly HospitalContext _context;
        private readonly IMapper _mapper;

        public NurseController(HospitalContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        // GET: api/Nurses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Nurse>>> GetNurses(
            [FromQuery] string? NurseCode = null,
            [FromQuery] string? Name = null,
            [FromQuery] string? Surname1 = null,
            [FromQuery] string? Surname2 = null,
            [FromQuery] string? Dni = null,
            [FromQuery] string? Phone = null,
            [FromQuery] string? Email = null,
            [FromQuery] string? Username = null,
            [FromQuery] string? Worktype = null,
            [FromQuery] string? Speciality = null,
            [FromQuery] int?[] Hospital = null

        )
        {
            IQueryable<Nurse> query = _context.Nurses;

            query = ApplyFilter(query, NurseCode, n => !string.IsNullOrWhiteSpace(NurseCode) && n.NurseCode.ToLower().Equals(NurseCode.ToLower()));
            query = ApplyFilter(query, Name, n => !string.IsNullOrWhiteSpace(Name) && n.Name.ToLower().StartsWith(Name.ToLower()));
            query = ApplyFilter(query, Surname1, n => !string.IsNullOrWhiteSpace(Surname1) && n.Surname1.ToLower().StartsWith(Surname1.ToLower()));
            query = ApplyFilter(query, Surname2, n => !string.IsNullOrWhiteSpace(Surname2) && n.Surname2.ToLower().StartsWith(Surname2.ToLower()));
            query = ApplyFilter(query, Dni, n => !string.IsNullOrWhiteSpace(Dni) && n.Dni.ToLower().StartsWith(Dni.ToLower()));
            query = ApplyFilter(query, Phone, n => !string.IsNullOrWhiteSpace(Phone) && n.Phone.ToLower().StartsWith(Phone.ToLower()));
            query = ApplyFilter(query, Email, n => !string.IsNullOrEmpty(Email) && n.Email.ToLower().StartsWith(Email.ToLower()));
            query = ApplyFilter(query, Username, n => !string.IsNullOrEmpty(Username) && n.Username.ToLower().StartsWith(Username.ToLower()));
            query = ApplyFilter(query, Worktype, n => !string.IsNullOrEmpty(Worktype) && n.Worktype.ToLower().StartsWith(Worktype.ToLower()));
            query = ApplyFilter(query, Speciality, n => !string.IsNullOrEmpty(Speciality) && n.Speciality.ToLower().StartsWith(Speciality.ToLower()));
            query = ApplyFilter(query, Hospital, n => Hospital.Contains(n.Hospital));

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

        // GET: api/Nurses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Nurse>> GetNurse(int id)
        {
            var nurse = await _context.Nurses.FindAsync(id);

            if (nurse == null)
            {
                return NotFound();
            }

            return nurse;
        }

        // PUT: api/Nurses/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNurse(int id, Nurse nurse)
        {
            if (id != nurse.Id)
            {
                return BadRequest();
            }

            _context.Entry(nurse).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NurseExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // POST: api/Nurses
        [HttpPost]
        public async Task<ActionResult<Nurse>> PostNurse(Nurse nurse)
        {
            _context.Nurses.Add(nurse);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetNurse), new { id = nurse.Id }, nurse);
        }

        // DELETE: api/Nurses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNurse(int id)
        {
            var nurse = await _context.Nurses.FindAsync(id);
            if (nurse == null)
            {
                return NotFound();
            }

            _context.Nurses.Remove(nurse);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PATCH: api/Nurses/5
        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchNurse(
            int id,
            [FromBody] JsonPatchDocument<Nurse> patchDocument
        )
        {
            if (patchDocument == null)
                return BadRequest();

            var nurse = await _context.Nurses.FindAsync(id);

            if (nurse == null)
                return NotFound();

            patchDocument.ApplyTo(nurse, ModelState);

            if (!TryValidateModel(nurse))
                return BadRequest(ModelState);

            await _context.SaveChangesAsync();

            return Ok(nurse);
        }

        private bool NurseExists(int id)
        {
            return _context.Nurses.Any(e => e.Id == id);
        }
    }
}