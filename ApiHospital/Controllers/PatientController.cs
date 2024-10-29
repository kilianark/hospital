using System;
using System.Collections.Generic;
using System.IO.Compression;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Cryptography.Xml;
using System.Threading.Tasks;
using ApiHospital.Data;
using ApiHospital.Models;
using AutoMapper;
using hospitalDTO.DTOapi;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace ApiHospital.Controllers
{
    [Authorize(Roles = "ADMIN")]
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

        // GET: api/Patients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Patient>>> GetPatients(
            [FromQuery] int? PatientCode,
            [FromQuery] string? Name,
            [FromQuery] string? Surname1,
            [FromQuery] string? Surname2,
            [FromQuery] string? Dni,
            [FromQuery] string? Cip,
            [FromQuery] string? Phone,
            [FromQuery] string? Zone,
            [FromQuery] int? BedId,
            [FromQuery] bool? Ingresados,
            [FromQuery] List<string>? Hospital
        )
        {
            IQueryable<Patient> query = _context.Patients;

            // Aplica los filtros usando el método helper 'ApplyFilter'
            query = ApplyFilter(query, PatientCode, p => p.PatientCode == PatientCode!.Value);
            query = ApplyFilter(query, Name, p => !string.IsNullOrWhiteSpace(Name) && p.Name.ToLower().StartsWith(Name.ToLower()));
            query = ApplyFilter(query, Surname1, p => !string.IsNullOrWhiteSpace(Surname1) && p.Surname1.ToLower().StartsWith(Surname1.ToLower()));
            query = ApplyFilter(query, Surname2, p => !string.IsNullOrWhiteSpace(Surname2) && p.Surname2.ToLower().StartsWith(Surname2.ToLower()));
            query = ApplyFilter(query, Dni, p => !string.IsNullOrWhiteSpace(Dni) && p.Dni.ToLower().StartsWith(Dni.ToLower()));
            query = ApplyFilter(query, Cip, p => !string.IsNullOrWhiteSpace(Cip) && p.CIP.ToLower().StartsWith(Cip.ToLower()));
            query = ApplyFilter(query, Phone, p => !string.IsNullOrWhiteSpace(Phone) && p.Phone.ToLower().StartsWith(Phone.ToLower()));
            query = ApplyFilter(query, Zone, p => !string.IsNullOrWhiteSpace(Zone) && p.Zone.ToLower().StartsWith(Zone.ToLower()));
            query = ApplyFilter(query, BedId, p => p.BedId == BedId!.Value);
            query = ApplyFilter(query, Ingresados, p => Ingresados == true && p.BedId != null);

            if (Hospital != null && Hospital.Count > 0)
            {
                query = query.Where(p => Hospital.Contains(p.Hospital, StringComparer.OrdinalIgnoreCase));
            }

            // Ejecuta la consulta y retorna el resultado
            var patients = await query.ToListAsync();

            if (!patients.Any())
            {
                return NotFound("No se han encontrado pacientes que coincidan con los criterios de búsqueda.");
            }

            return Ok(patients);
        }

        // Método helper para aplicar filtros de forma condicional
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



        // GET: api/Patient/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Patient>> GetPatient(int id)
        {
            var patient = await _context.Patients.FindAsync(id);

            if (patient == null)
                return NotFound();

            return patient;
        }

        // PUT: api/Patient/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPatient(int id, PatientDTO patientDTO)
        {
            var patient = await _context.Patients.FindAsync(id);

            if (patient == null)
                return NotFound();

            _mapper.Map(patientDTO, patient);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PatientExists(id))
                    return NotFound();
                else
                    throw;
            }
            return NoContent();
        }

        // POST: api/Patient
        [HttpPost]
        public async Task<ActionResult<Patient>> PostPatient(Patient patient)
        {

            if (!BedExists(patient.BedId))
                patient.BedId = null;

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
                return NotFound();

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PatientExists(int id)
        {
            return _context.Patients.Any(e => e.Id == id);
        }

        private bool BedExists(int? id)
        {
            if (id == null)
                return false;
            return _context.Beds.Any(e => e.Id == id);
        }
    }
}
