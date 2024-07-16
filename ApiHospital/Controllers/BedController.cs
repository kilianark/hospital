using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiHospital.Data;
using ApiHospital.Models;
using hospitalDTO.APIdto;
using AutoMapper;

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
        public async Task<ActionResult<IEnumerable<Bed>>> GetBeds()
        {
            return await _context.Beds.Include(x => x.Patient).ToListAsync();
        }

        // GET: api/Bed/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Bed>> GetBed(int id)
        {
            var bed = await _context.Beds.Include(x => x.Patient).Where(x => x.Id == id).FindAsync(id);

            if (bed == null)
            {
                return NotFound();
            }

            return bed;
        }

        // PUT: api/Bed/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBed(int id, Bed bed)
        {
            if (id != bed.Id)
            {
                return BadRequest();
            }

            _context.Entry(bed).State = EntityState.Modified;

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
            _context.Beds.Add(_mapper.Map<Bed>(bedDTO));
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBed", new { id = bed.Id }, bed);
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

        private bool BedExists(int id)
        {
            return _context.Beds.Any(e => e.Id == id);
        }
    }
}
