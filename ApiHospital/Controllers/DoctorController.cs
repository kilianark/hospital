using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiHospital.Data;
using ApiHospital.Models;

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
        public async Task<ActionResult<IEnumerable<Doctors>>> GetDoctor()
        {
            return await _context.Doctors.ToListAsync();
        }

        // GET: api/Doctors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Doctors>> GetDoctor(int id)
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
        public async Task<IActionResult> PutDoctor(int id, Doctors Doctors)
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
        public async Task<ActionResult<Doctors>> PostDoctor(Doctors Doctors)
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
        public async Task<IActionResult> PatchBed(int id, [FromBody] JsonPatchDocument<Bed> patchDocument)
        {
            if (patchDocument == null) return BadRequest();

            var doctor = await _context.Doctors.FindAsync(id);

            if (doctor == null) return NotFound();

            patchDocument.ApplyTo(doctor, ModelState);

            bool isValidPatch = TryValidateModel(doctor);

            if (!isValidPatch) return BadRequest(ModelState);

            await _context.SaveChangesAsync();

            return Ok();
    
        }

        private bool DoctorExists(int id)
        {
            return _context.Doctors.Any(e => e.Id == id);
        }
    }
}
