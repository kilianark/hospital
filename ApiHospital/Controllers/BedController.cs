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
    [Route("api/Beds")]
    [ApiController]
    public class BedController : ControllerBase
    {
        private readonly HospitalContext _context;
        private readonly IMapper _mapper;

        public BedController(HospitalContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Beds
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Bed>>> GetAllBeds(
            [FromQuery] int? RoomId = null,
            [FromQuery] bool? availability = null
        )
        {
            IQueryable<Bed> query = _context.Beds;

            query = ApplyFilter(query, RoomId, r => r.RoomId == RoomId!.Value);
            query = ApplyFilter(query, availability, a => a.Availability == availability.Value);

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

        // GET: api/Beds/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Bed>> GetBedById(int id)
        {
            var bed = await _context.Beds.FindAsync(id);

            if (bed == null)
            {
                return NotFound();
            }

            return bed;
        }

        // PUT: api/Beds/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBed(int id, BedDTO bedDTO)
        {
            if (id != bedDTO.Id)
            {
                return BadRequest();
            }

            var bed = await _context.Beds.FindAsync(id);
            if (bed == null)
            {
                return NotFound();
            }

            _mapper.Map(bedDTO, bed);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BedExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // POST: api/Beds
        [HttpPost]
        public async Task<ActionResult<Bed>> PostBed(BedDTO bedDTO)
        {
            var bed = _mapper.Map<Bed>(bedDTO);
            if (!RoomExists(bed.RoomId))
            {
                return BadRequest("Room doesn't exist");
            }

            _context.Beds.Add(bed);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBedById), new { id = bed.Id }, bed);
        }

        // DELETE: api/Beds/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBed(int id)
        {
            var bed = await _context.Beds.FindAsync(id);
            if (bed == null)
            {
                return NotFound();
            }

            _context.Beds.Remove(bed);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PATCH: api/Beds/5
        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchBedById(
            int id,
            [FromBody] JsonPatchDocument<Bed> patchDocument
        )
        {
            if (patchDocument == null)
            {
                return BadRequest();
            }

            var bed = await _context.Beds.FindAsync(id);

            if (bed == null)
            {
                return NotFound();
            }

            patchDocument.ApplyTo(bed, ModelState);

            if (!TryValidateModel(bed))
            {
                return BadRequest(ModelState);
            }

            await _context.SaveChangesAsync();

            return Ok(bed);
        }

        private bool BedExists(int id)
        {
            return _context.Beds.Any(e => e.Id == id);
        }

        private bool RoomExists(int id)
        {
            return _context.Rooms.Any(e => e.Id == id);
        }
    }
}
