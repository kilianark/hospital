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
    [Route("api/Consultations")]
    [ApiController]
    public class ConsultationController : ControllerBase
    {
        private readonly HospitalContext _context;
        private readonly IMapper _mapper;

        public ConsultationController(HospitalContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Consultations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ConsultationDTO>>> GetAllConsultations(
            [FromQuery] int? Id = null,
            [FromQuery] int? Patient_id = null,
            [FromQuery] int? Doctor_id = null,
            [FromQuery] int? ReasonId = null,
            [FromQuery] DateTime? Date_request = null,
            [FromQuery] DateTime? Date_consulta = null,
            [FromQuery] string? Zone = null
        )
        {
            IQueryable<Consultation> query = _context.Consultations;
            query = ApplyFilter(query, Id, c => c.Id == Id!.Value);
            query = ApplyFilter(query, Patient_id, c => c.Patient_id == Patient_id.Value);
            query = ApplyFilter(query, Doctor_id, c => c.Doctor_id == Doctor_id.Value);
            query = ApplyFilter(query, ReasonId, c => c.ReasonId == ReasonId.Value);
            query = ApplyFilter(query, Date_request, c => c.date_request == Date_request.Value);
            query = ApplyFilter(query, Date_consulta, c => c.date_consulta == Date_consulta.Value);
            query = ApplyFilter(query, Zone, c => Zone != null && !string.IsNullOrWhiteSpace(c.Zone) && c.Zone.ToLower().StartsWith(Zone.ToLower()));
            var result = await query.ToListAsync();
            return Ok(_mapper.Map<IEnumerable<ConsultationDTO>>(result));
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

        // GET: api/Consultations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ConsultationDTO>> GetConsultation(int id)
        {
            var consultation = await _context.Consultations.FirstOrDefaultAsync(c => c.Id == id);

            if (consultation == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<ConsultationDTO>(consultation));
        }

        // PUT: api/Consultations/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutConsultation(int id, ConsultationDTO ConsultationDTO)
        {
            if (id != ConsultationDTO.Id)
            {
                return BadRequest();
            }

            var consultation = await _context.Consultations.FindAsync(id);
            if (consultation == null)
            {
                return NotFound();
            }

            _mapper.Map(ConsultationDTO, consultation);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ConsultationExists(id))
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

        // POST: api/Consultations
        [HttpPost]
        public async Task<ActionResult<ConsultationDTO>> PostConsultation(ConsultationDTO ConsultationDTO)
        {
            if (await _context.Consultations.AnyAsync(c => c.Id == ConsultationDTO.Id))
            {
                return BadRequest("Consultation number already exists.");
            }

            var consultation = _mapper.Map<Consultation>(ConsultationDTO);
            _context.Consultations.Add(consultation);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetConsultation), new { id = consultation.Id }, _mapper.Map<ConsultationDTO>(consultation));
        }

        // DELETE: api/Consultations/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteConsultation(int id)
        {
            var consultation = await _context.Consultations.FindAsync(id);
            if (consultation == null)
            {
                return NotFound();
            }

            _context.Consultations.Remove(consultation);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PATCH: api/Consultations/5
        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchConsultation(
            int id,
            [FromBody] JsonPatchDocument<ConsultationDTO> patchDocument
        )
        {
            if (patchDocument == null)
            {
                return BadRequest();
            }

            var consultation = await _context.Consultations.FindAsync(id);

            if (consultation == null)
            {
                return NotFound();
            }

            var consultationDTO = _mapper.Map<ConsultationDTO>(consultation);
            patchDocument.ApplyTo(consultationDTO, ModelState);

            if (!TryValidateModel(consultationDTO))
            {
                return BadRequest(ModelState);
            }

            _mapper.Map(consultationDTO, consultation);
            await _context.SaveChangesAsync();

            return Ok(_mapper.Map<ConsultationDTO>(consultation));
        }

        private bool ConsultationExists(int id)
        {
            return _context.Consultations.Any(e => e.Id == id);
        }
    }
}
