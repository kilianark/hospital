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
using ApiHospital.Service;

namespace ApiHospital.Controllers
{
    [Route("api/Patients")]
    [ApiController]
    public class PatientController : ControllerBase
    {

        private readonly PatientService _service;

        public PatientController(PatientService service)
        {
            _service = service;
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
            [FromQuery] string? Area,
            [FromQuery] int? BedId,
            [FromQuery] bool? Ingresados,
            [FromQuery] int? Hospital
        )
        {
            IQueryable<Patient> query = _service.GetPatients(
                PatientCode,
                Name,
                Surname1,
                Surname2,
                Dni,
                Cip,
                Phone,
                Zone,
                Area,
                BedId,
                Ingresados,
                Hospital
            );
            

            // Ejecuta la consulta y retorna el resultado
            var patients = await query.ToListAsync();

            if (!patients.Any())
            {
                return NotFound("No se han encontrado pacientes que coincidan con los criterios de búsqueda.");
            }

            return Ok(patients);
        }

        // GET: api/Patient/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Patient>> GetPatient(int id)
        {
            var patient = await _service.GetPatientById(id);

            if (patient == null)
                return NotFound();

            return patient;
        }

        // PUT: api/Patient/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPatient(int id, PatientDTO patientDTO)
        {   
            
            var patient = await _service.GetPatientById(id);

            if (patient == null)
                return NotFound();

            var updated = await _service.UpdatePatient(patientDTO, patient);
            
            if (updated) {
                return NoContent();
            } else {
                return NotFound();
            }
        }

        // POST: api/Patient
        [HttpPost]
        public async Task<ActionResult<Patient>> PostPatient(PatientDTO patientDTO)
        {

            if (!_service.BedExists(patientDTO.BedId)) patientDTO.BedId = null;

            var patient = await _service.CreatePatient(patientDTO);

            return Created($"/Patients/{patient.Id}", patient);
        }

        // DELETE: api/Patient/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var patient = await _service.GetPatientById(id);

            if (patient == null)
                return NotFound();

            if (patient.BedId != null)
                return BadRequest();
                
            await _service.DeletePatient(patient);


            return NoContent();
        }
    }
        
}
