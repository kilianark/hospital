using System;
using System.Collections.Generic;
using System.Linq;
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
        public async Task<ActionResult<IEnumerable<Doctor>>> GetDoctor(
            [FromQuery] int? DoctorCode = null,
            [FromQuery] string? Name = null,
            [FromQuery] string? Surname1 = null,
            [FromQuery] string? Surname2 = null,
            [FromQuery] string? Dni = null,
            [FromQuery] DateTime? BirthDate = null,
            [FromQuery] string? Country = null,
            [FromQuery] string? Address = null,
            [FromQuery] string? Phone = null,
            [FromQuery] string? Email = null,
            [FromQuery] string? CIP = null,
            [FromQuery] string? Gender = null,
            [FromQuery] string? Username = null,
            [FromQuery] string? Worktype = null,
            [FromQuery] string? Speciality = null
        )
        {
            IQueryable<Doctor> query = _context.Doctors;

            if (DoctorCode.HasValue)
            {
                query = query.Where(d => d.DoctorCode == DoctorCode.Value);
            }

            if (!string.IsNullOrEmpty(Name))
            {
                query = query.Where(d => d.Name.StartsWith(Name));
            }

            if (!string.IsNullOrEmpty(Surname1))
            {
                query = query.Where(d => d.Surname1.StartsWith(Surname1));
            }

            if (!string.IsNullOrEmpty(Surname2))
            {
                query = query.Where(d => d.Surname1.StartsWith(Surname2));
            }

            if (!string.IsNullOrEmpty(Dni))
            {
                query = query.Where(d => d.Dni.StartsWith(Dni));
            }

            if (BirthDate.HasValue)
            {
                //query = query.Where(d => d.BirthDate == BirthDate.Value);
            }

            if (!string.IsNullOrEmpty(Country))
            {
                query = query.Where(d => d.Country.StartsWith(Country));
            }

            if (!string.IsNullOrEmpty(Address))
            {
                query = query.Where(d => d.Address.StartsWith(Address));
            }

            if (!string.IsNullOrEmpty(Phone))
            {
                query = query.Where(d => d.Phone.StartsWith(Phone));
            }

            if (!string.IsNullOrEmpty(Email))
            {
                query = query.Where(d => d.Email.StartsWith(Email));
            }

            if (!string.IsNullOrEmpty(Gender))
            {
                query = query.Where(d => d.Gender.StartsWith(Gender));
            }

            if (!string.IsNullOrEmpty(Username))
            {
                query = query.Where(d => d.Username.StartsWith(Username));
            }

            if (!string.IsNullOrEmpty(Worktype))
            {
                query = query.Where(d => d.Worktype.StartsWith(Worktype));
            }

            if (!string.IsNullOrEmpty(Speciality))
            {
                query = query.Where(d => d.Speciality.StartsWith(Speciality));
            }

            return await _context.Doctors.ToListAsync();
        }

        // GET: api/Doctors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Doctor>> GetDoctor(int id)
        {
            var Doctors = await _context.Doctors.FindAsync(id);

            if (Doctors == null)
            {
                return NotFound();
            }

            return Doctors;
        }

        // PUT: api/Doctors/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDoctor(int id, Doctor Doctors)
        {
            if (id != Doctors.Id)
            {
                return BadRequest();
            }

            _context.Entry(Doctors).State = EntityState.Modified;

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
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Doctors
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Doctor>> PostDoctor(Doctor Doctors)
        {
            _context.Doctors.Add(Doctors);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDoctor", new { id = Doctors.Id }, Doctors);
        }

        // DELETE: api/Doctors/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            var Doctors = await _context.Doctors.FindAsync(id);
            if (Doctors == null)
            {
                return NotFound();
            }

            _context.Doctors.Remove(Doctors);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PATCH: api/Beds/5
        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchBed(
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

            bool isValidPatch = TryValidateModel(doctor);

            if (!isValidPatch)
                return BadRequest(ModelState);

            await _context.SaveChangesAsync();

            return Ok();
        }

        private bool DoctorExists(int id)
        {
            return _context.Doctors.Any(e => e.Id == id);
        }
    }
}
