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
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.JsonPatch;

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
        public async Task<ActionResult<IEnumerable<Patient>>> GetPatients
        ([FromQuery] int? PatientCode = null, [FromQuery] string? Name = null, [FromQuery] string? Surname1 = null, [FromQuery] string? Surname2 = null, [FromQuery] string? Dni = null, [FromQuery] string? Phone = null, [FromQuery] string? Status = null, [FromQuery] int? BedId = null )
        {
            IQueryable <Patient> query = _context.Patients;

            if (PatientCode.HasValue) query = query.Where(p => p.PatientCode == PatientCode.Value);

            if (!string.IsNullOrEmpty(Name)) query = query.Where(p => p.Name.Contains(Name));

            if (!string.IsNullOrEmpty(Surname1)) query = query.Where(p => p.Surname1.Contains(Surname1));

            if (!string.IsNullOrEmpty(Surname2)) query = query.Where(p => p.Surname1.Contains(Surname2));

            if (!string.IsNullOrEmpty(Dni)) query = query.Where(p => p.Dni.Contains(Dni));

            if (!string.IsNullOrEmpty(Phone)) query = query.Where(p => p.Phone.Contains(Phone));

            if (!string.IsNullOrEmpty(Status)) query = query.Where(p => p.Status.Contains(Status));

            if (BedId.HasValue) query = query.Where(p => p.BedId == BedId.Value);
        
            return await query.ToListAsync();
        }

        // GET: api/Patient/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Patient>> GetPatient(int id)
        {
            var patient = await _context.Patients.FindAsync(id);

            if (patient == null) return NotFound();

            return patient;
        }

        [HttpGet("/patients/{name}")]
        public async Task<ActionResult<IEnumerable<Patient>>> GetPatientName(string name) 
        {
            var patients = from patient in _context.Patients select patient;

            patients = patients.Where(p => p.Name.Contains(name));

            return await patients.ToListAsync();

        }

        // PUT: api/Patient/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPatient(int id, PatientDTO patientDTO)
        {
            if (id != patientDTO.PatientCode) return BadRequest();

            var patient = await _context.Patients.FindAsync(id);
            if (patient == null) return NotFound();

            _mapper.Map(patientDTO, patient);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PatientExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // POST: api/Patient
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Patient>> PostPatient(PatientDTO patientDTO)
        {

            var patient = _mapper.Map<Patient>(patientDTO);
            
            if (!BedExists(patient.BedId)) patient.BedId = null;
            
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            return Created($"/Patients/{patient.Id}", patient);
        }

        // DELETE: api/Patient/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var patient = await _context.Patients.FindAsync(id);

            if (patient == null) return NotFound();

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        // PATCH: api/Patient/5
        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchPatient(int id, [FromBody] JsonPatchDocument<Patient> patchDocument)
        {
            if (patchDocument == null) return BadRequest();

            var patient = await _context.Patients.FindAsync(id);

            if (patient == null) return NotFound();

            patchDocument.ApplyTo(patient, ModelState);

            bool isValidPatch = TryValidateModel(patient);

            if (!isValidPatch) return BadRequest(ModelState);

            await _context.SaveChangesAsync();

            return Ok();
    
        }
        private bool PatientExists(int id)
        {
            return _context.Patients.Any(e => e.Id == id);
        }

        private bool BedExists(int? id)
        {
            if (id == null) return false;
            return _context.Beds.Any(e => e.Id == id);
        }
    }
}
