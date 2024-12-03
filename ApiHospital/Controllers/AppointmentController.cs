using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using ApiHospital.Data;
using ApiHospital.Models;
using AutoMapper;
using hospitalDTO.DTOapi;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ApiHospital.Controllers
{
    [Route("api/Appointments")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly HospitalContext _context;
        private readonly IMapper _mapper;

        public AppointmentController(HospitalContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Appointments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAllAppointments(
            [FromQuery] int? patientId,
            [FromQuery] int? doctorId,
            [FromQuery] DateTime? appointmentDate,
            [FromQuery] string? status
        )
        {
            IQueryable<Appointment> query = _context.Appointments;
            query = ApplyFilter(query, patientId, a => a.PatientId == patientId.Value);
            query = ApplyFilter(query, doctorId, a => a.DoctorId == doctorId.Value);
            query = ApplyFilter(query, appointmentDate, a => a.AppointmentDate.Date == appointmentDate.Value.Date);
            query = ApplyFilter(query, status, a => !string.IsNullOrWhiteSpace(a.Status) && a.Status.ToLower().StartsWith(status.ToLower()));

            var appointments = await query.ToListAsync();
            return Ok(_mapper.Map<IEnumerable<AppointmentDTO>>(appointments));
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

        // GET: api/Appointments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Appointment>> GetAppointmentById(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound();
            }

            return appointment;
        }

        // PUT: api/Appointments/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAppointment(int id, AppointmentDTO appointmentDTO)
        {
            if (id != appointmentDTO.Id)
            {
                return BadRequest();
            }

            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound();
            }

            _mapper.Map(appointmentDTO, appointment);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AppointmentExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // POST: api/Appointments
        [HttpPost]
        public async Task<ActionResult<Appointment>> PostAppointment(AppointmentDTO appointmentDTO)
        {
            var appointment = _mapper.Map<Appointment>(appointmentDTO);

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAppointmentById), new { id = appointment.Id }, appointment);
        }

        // DELETE: api/Appointments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound();
            }

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PATCH: api/Appointments/5
        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchAppointmentById(
            int id,
            [FromBody] JsonPatchDocument<Appointment> patchDocument
        )
        {
            if (patchDocument == null)
            {
                return BadRequest();
            }

            var appointment = await _context.Appointments.FindAsync(id);

            if (appointment == null)
            {
                return NotFound();
            }

            patchDocument.ApplyTo(appointment, ModelState);

            if (!TryValidateModel(appointment))
            {
                return BadRequest(ModelState);
            }

            await _context.SaveChangesAsync();

            return Ok(appointment);
        }

        private bool AppointmentExists(int id)
        {
            return _context.Appointments.Any(e => e.Id == id);
        }

        // GET: api/Appointments/undo/5
        [HttpGet("undo/{id}")]
        public async Task<IActionResult> UndoDeleteAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);

            if (appointment == null)
            {
                return NotFound();
            }

            appointment.Undo();

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Appointments.Any(e => e.Id == appointment.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw; 
                }
            }
            return Ok(appointment);
        }
    }
}
