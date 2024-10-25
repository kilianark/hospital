using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using ApiHospital.Data;
using ApiHospital.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ApiHospital.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        private readonly HospitalContext _context;

        public DoctorController(HospitalContext context)
        {
            _context = context;
        }

        // GET: api/Doctors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Doctor>>> GetDoctors(
            [FromQuery] int? DoctorCode = null,
            [FromQuery] string? Name = null,
            [FromQuery] string? Surname1 = null,
            [FromQuery] string? Surname2 = null,
            [FromQuery] string? Dni = null,
            [FromQuery] string? Phone = null,
            [FromQuery] string? Email = null,
            [FromQuery] string? Username = null,
            [FromQuery] string? Worktype = null,
            [FromQuery] string? Speciality = null
        )
        {
            IQueryable<Doctor> query = _context.Doctors;

            query = ApplyFilter(query, DoctorCode, d => d.DoctorCode == DoctorCode!.Value);
            query = ApplyFilter(query, Name, d => !string.IsNullOrWhiteSpace(Name) && d.Name.ToLower().StartsWith(Name.ToLower()));
            query = ApplyFilter(query, Surname1, d => !string.IsNullOrWhiteSpace(Surname1) && d.Surname1.ToLower().StartsWith(Surname1.ToLower()));
            query = ApplyFilter(query, Surname2, d => !string.IsNullOrWhiteSpace(Surname2) && d.Surname2.ToLower().StartsWith(Surname2.ToLower()));
            query = ApplyFilter(query, Dni, d => !string.IsNullOrWhiteSpace(Dni) && d.Dni.ToLower().StartsWith(Dni.ToLower()));
            query = ApplyFilter(query, Phone, d => !string.IsNullOrWhiteSpace(Phone) && d.Phone.ToLower().StartsWith(Phone.ToLower()));
            query = ApplyFilter(query, Email, d => !string.IsNullOrEmpty(Email) && d.Email.ToLower().StartsWith(Email.ToLower()));
            query = ApplyFilter(query, Username, d => !string.IsNullOrEmpty(Username) && d.Username.ToLower().StartsWith(Username.ToLower()));
            query = ApplyFilter(query, Worktype, d => !string.IsNullOrEmpty(Worktype) && d.Worktype.ToLower().StartsWith(Worktype.ToLower()));
            query = ApplyFilter(query, Speciality, d => !string.IsNullOrEmpty(Speciality) && d.Speciality.ToLower().StartsWith(Speciality.ToLower()));

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

        // GET: api/Doctors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Doctor>> GetDoctor(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);

            if (doctor == null)
            {
                return NotFound();
            }

            return doctor;
        }

        // PUT: api/Doctors/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDoctor(int id, Doctor doctor)
        {
            if (id != doctor.Id)
            {
                return BadRequest();
            }

            _context.Entry(doctor).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DoctorExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // POST: api/Doctors
        [HttpPost]
        public async Task<ActionResult<Doctor>> PostDoctor(Doctor doctor)
        {
            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDoctor), new { id = doctor.Id }, doctor);
        }

        // DELETE: api/Doctors/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null)
            {
                return NotFound();
            }

            _context.Doctors.Remove(doctor);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PATCH: api/Doctors/5
        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchDoctor(
            int id,
            [FromBody] JsonPatchDocument<Doctor> patchDocument
        )
        {
            if (patchDocument == null)
                return BadRequest();

            var doctor = await _context.Doctors.FindAsync(id);

            if (doctor == null)
                return NotFound();

            patchDocument.ApplyTo(doctor, ModelState);

            if (!TryValidateModel(doctor))
                return BadRequest(ModelState);

            await _context.SaveChangesAsync();

            return Ok(doctor);
        }

        private bool DoctorExists(int id)
        {
            return _context.Doctors.Any(e => e.Id == id);
        }
    }
}
