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
using AutoMapper;

namespace ApiHospital.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HospitalController : ControllerBase
    {
        private readonly HospitalContext _context;

        public HospitalController(HospitalContext context)
        {
            _context = context;
        }

        // GET: api/Hospitals
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Hospital>>> GetHospitals(
            [FromQuery] int?[] Hospital = null,
            [FromQuery] string? hospitalName = null
        )
        {
            IQueryable<Hospital> query = _context.Hospitals;

            // Aplicar filtros usando ApplyFilter
            query = ApplyFilter(query, Hospital, h => Hospital.Contains(h.HospitalCode));
            query = ApplyFilter(query, hospitalName, h => !string.IsNullOrWhiteSpace(hospitalName) && h.HospitalName.ToLower().StartsWith(hospitalName.ToLower()));

            Console.WriteLine("Role" + HttpContext.User.IsInRole("manage_room"));
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

        // GET: api/Hospitals/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Hospital>> GetHospital(int id)
        {
            var hospital = await _context.Hospitals.FindAsync(id);

            if (hospital == null)
            {
                return NotFound();
            }

            return hospital;
        }

        // POST: api/Hospitals
        [HttpPost]
        public async Task<ActionResult<Hospital>> PostHospital(Hospital hospital)
        {
            _context.Hospitals.Add(hospital);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetHospital), new { id = hospital.HospitalCode }, hospital);
        }

        // PUT: api/Hospitals/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHospital(int id, Hospital hospital)
        {
            if (id != hospital.HospitalCode)
            {
                return BadRequest();
            }

            _context.Entry(hospital).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HospitalExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/Hospitals/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHospital(int id)
        {
            var hospital = await _context.Hospitals.FindAsync(id);
            if (hospital == null)
            {
                return NotFound();
            }

            _context.Hospitals.Remove(hospital);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool HospitalExists(int id)
        {
            return _context.Hospitals.Any(e => e.HospitalCode == id);
        }
    }
}