using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiHospital.Data;
using ApiHospital.Models;
using System.IO.Compression;
using System.Security.Cryptography.Xml;
using hospitalDTO.DTOapi;
using AutoMapper;

namespace ApiHospital.Controllers
{
    [Route("api/Patients")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly HospitalContext _context;
        private readonly IMapper _mapper;

        public PatientController(HospitalContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        // GET: api/Patient
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Patient>>> GetPatients()
        {
            return await _context.Patients.ToListAsync();
        }

        // GET: api/Patient/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Patient>> GetPatient(int id)
        {
            var patient = await _context.Patients.FirstOrDefaultAsync();

            if (patient == null)
            {
                return NotFound();
            }

            return patient;
        }

        // PUT: api/Patient/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPatient(int id, PatientDTO patientDTO)
        {
            if (id != patientDTO.Id)
            {
                return BadRequest();
            }

            var patient = await _context.Patients.FindAsync(id);
            if (patient == null) return NotFound();


            _mapper.Map(patientDTO, patient);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PatientExists(id))
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

        // POST: api/Patient
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Patient>> PostPatient(PatientDTO patientDTO)
        {

            var patient = _mapper.Map<Patient>(patientDTO);
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            return Created($"/Patients/{patient.Id}", patient);
        }

        // DELETE: api/Patient/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
            {
                return NotFound();
            }

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PatientExists(int id)
        {
            return _context.Patients.Any(e => e.Id == id);
        }
    }
}
