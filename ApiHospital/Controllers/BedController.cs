using System;
using System.Collections.Generic;
using System.Linq;
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

        // GET: api/Bed
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Bed>>> GetBeds(
            [FromQuery] bool? availability = null
        )
        {
            IQueryable<Bed> query = _context.Beds;

            if (availability.HasValue)
            {
                query = query.Where(b => b.Availability == availability.Value);
            }

            return await _context.Beds.ToListAsync();
        }

        // GET: api/Bed/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Bed>> GetBed(int id)
        {
            var bed = await _context.Beds.FindAsync(id);

            if (bed == null)
            {
                return NotFound();
            }

            return bed;
        }

        // PUT: api/Bed/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBed(int id, BedDTO bedDTO)
        {
            if (id != bedDTO.Id)
            {
                return BadRequest();
            }

            var bed = await _context.Beds.FindAsync(id);
            if (bed == null)
                return NotFound();

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
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Bed
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
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

            return Created($"/beds/{bed.Id}", bed);
        }

        // DELETE: api/Bed/5
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
        public async Task<IActionResult> PatchBed(
            int id,
            [FromBody] JsonPatchDocument<Bed> patchDocument
        )
        {
            if (patchDocument == null)
                return BadRequest();

            var bed = await _context.Beds.FindAsync(id);

            if (bed == null)
                return NotFound();

            patchDocument.ApplyTo(bed, ModelState);

            bool isValidPatch = TryValidateModel(bed);

            if (!isValidPatch)
                return BadRequest(ModelState);

            await _context.SaveChangesAsync();

            return Ok();
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
